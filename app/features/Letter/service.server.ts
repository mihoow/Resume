import { type ClientSession, type MongoClient, MongoServerError } from 'mongodb';
import type {
    CoverLetterDocument,
    CoverLetterTemplate,
    EditTextFormData,
    TemplatesByLanguage,
    TemplatesListItem,
} from './type';
import type { Locale } from '~/types/global';
import { ValidationError, object, string } from 'yup';

import { ActionHandler } from '~/services/action.server';
import { ActionType } from '~/config';
import { connectToDatabase } from '~/services/db.server';
import { isCompanyExpired } from '~/services/companies.server';
import { readToken } from '~/services/authToken.server';
import { isLetterDocument, isLetterTemplate } from './utils';
import { DEFAULT_TEMPLATE_NAME } from './config';

interface RecursiveSimpleObject {
    [x: string]: string | null | RecursiveSimpleObject;
}

function dotNotationToNestedObject(data: any): RecursiveSimpleObject {
    if (!data || typeof data !== 'object') return {};

    const result: RecursiveSimpleObject = {};

    for (const keys in data) {
        const value = data[keys];
        const nestedKeys = keys.split('.');
        const lastKeyIndex = nestedKeys.length - 1;

        nestedKeys.reduce((container, subKey, i) => {
            if (i === lastKeyIndex) {
                container[subKey] = typeof value === 'string' ? (value === '' ? null : value) : null;

                return {} as RecursiveSimpleObject;
            }

            if (!(subKey in container)) {
                container[subKey] = {};
            }

            return container[subKey] as RecursiveSimpleObject;
        }, result);
    }

    return result;
}

function templatesCollection(db: MongoClient) {
    return db.db('resume').collection<CoverLetterTemplate>('cover-letter-templates');
}

function documentsCollection(db: MongoClient) {
    return db.db('resume').collection<CoverLetterDocument>('cover-letters');
}

export function getCompanyCodeFromUrl(url: string) {
    const { searchParams } = new URL(url);
    const token = searchParams.get('token');

    if (!token || token === 'public') return null;

    try {
        const { companyCode } = readToken(token);

        return companyCode;
    } catch {
        return null;
    }
}

export async function getCoverLetter(
    companyCode: string | null,
    language: Locale
): Promise<CoverLetterTemplate | CoverLetterDocument | null> {
    const db = await connectToDatabase();
    const letters = await documentsCollection(db)
        .aggregate([
            { $match: { companyCode } },
            { $lookup: { from: 'companies', localField: 'companyCode', foreignField: 'code', as: 'companies' } },
            {
                $unionWith: {
                    coll: 'cover-letter-templates',
                    pipeline: [{ $match: { name: DEFAULT_TEMPLATE_NAME, language } }],
                },
            },
        ])
        .toArray();

    const personalizedLetter = letters.find(isLetterDocument);
    const letterFallback = letters.find(isLetterTemplate) || null;

    if (!personalizedLetter) {
        return letterFallback;
    }

    const {
        companies: [company],
        ...coverLetter
    } = personalizedLetter;

    if (!company || isCompanyExpired(company)) {
        return letterFallback;
    }

    return coverLetter;
}

export async function getListOfTemplates() {
    const db = await connectToDatabase();

    const templates = (await templatesCollection(db)
        .find()
        .sort({ name: 1 })
        .project({ _id: 0, name: 1, language: 1 })
        .toArray()) as TemplatesListItem[];

    return templates.reduce<TemplatesByLanguage>(
        (acc, template) => {
            acc[template.language].push(template);

            return acc;
        },
        {
            en: [],
            pl: [],
        }
    );
}

export async function getTemplate(name: string, language: Locale): Promise<CoverLetterTemplate | null> {
    if (name === 'none') return null;

    if (name === 'empty') {
        return {
            name: 'empty',
            language,
            html: '',
        } satisfies CoverLetterTemplate;
    }

    const db = await connectToDatabase();

    return templatesCollection(db).findOne({ name, language });
}

export async function saveCoverLetter(request: Request) {
    const action = new ActionHandler(request, ActionType.EDIT_COVER_LETTER);
    const requestData = dotNotationToNestedObject(await request.json());

    const coverLetterSchema = object({
        date: string().required().nullable(),
        recipient: object({
            names: string().required().nullable(),
            surname: string().required().nullable(),
            sex: string().required().oneOf(['male', 'female']).nullable(),
            jobPosition: string().required().nullable(),
        }),
        company: object({
            name: string().required().nullable(),
            addressLine1: string().required().nullable(),
            addressLine2: string().required().nullable(),
        }),
        contacts: object({
            phone: string().required().nullable(),
            email: string().required().nullable(),
        }),
        showRecipient: string().required().oneOf(['on', 'off']),
        language: string().required().oneOf(['en', 'pl']),
        html: string().required(),
        nameAsTemplate: string().required().nullable(),
        saveAs: string().required().oneOf(['template', 'document', 'template-and-document']),
    });

    try {
        const companyCode = getCompanyCodeFromUrl(request.url);
        const {
            date,
            recipient,
            company,
            contacts,
            showRecipient,
            language: untypedLanguage,
            html,
            nameAsTemplate,
            saveAs: untypedSaveAs,
        } = await coverLetterSchema.validate(requestData);
        const db = await connectToDatabase();

        const language = untypedLanguage as Locale;
        const saveAs = untypedSaveAs as EditTextFormData['saveAs'];

        async function updateTemplate(session?: ClientSession) {
            if (!nameAsTemplate) {
                throw new Error("You want to save letter as template, you need to provide it's name");
            }

            return templatesCollection(db).updateOne(
                { name: nameAsTemplate, language },
                {
                    $set: {
                        name: nameAsTemplate,
                        language,
                        html,
                    },
                },
                { upsert: true, session }
            );
        }

        async function updateDocument(session?: ClientSession) {
            if (!companyCode) {
                throw new Error('You want to save letter as document, you need to provide a company code.');
            }

            return documentsCollection(db).updateOne(
                { companyCode },
                {
                    $set: {
                        companyCode,
                        language,
                        html,
                        date,
                        recipient,
                        company,
                        contacts,
                        showRecipient: showRecipient === 'on',
                        templateName: 'none', // TODO: fill this
                    },
                },
                { upsert: true, session }
            );
        }

        if (saveAs === 'template') {
            await updateTemplate();
        }

        if (saveAs === 'document') {
            await updateDocument();
        }

        if (saveAs === 'template-and-document') {
            await db.withSession(async (session) => {
                return session.withTransaction(async (session) => {
                    await Promise.all([updateTemplate(session), updateDocument(session)]);

                    return true;
                });
            });
        }

        return action.sendSuccessData({ message: 'adminAuthSuccess' });
    } catch (error) {
        console.log(error);

        if (error instanceof ValidationError) {
            return action.sendServerError({ message: 'Validation error', messageBody: error.errors.join('. ') });
        }

        if (error instanceof MongoServerError) {
            return action.sendServerError({ message: 'MongoDB error', messageBody: error.message });
        }

        if (error instanceof Error) {
            return action.sendServerError({ message: 'Server error', messageBody: error.message });
        }

        return action.sendUnknownServerError();
    }
}
