import { ActionType, COMPANY_AUTHORIZATION_TIME_MS, Page } from '~/config';
import type { CompanyData, DbCompanyData, ValidationErrorData } from '~/types/global';
import { createToken, doPasswordsMatch, getToken, readToken } from './authToken.server';

import { ActionHandler } from './action.server';
import { MongoServerError } from 'mongodb';
import type { WithId } from 'mongodb';
import { connectToDatabase } from './db.server';
import { getUserSession } from './userSession';

type Validation =
    | { ok: true; fields: { companyCode: string; companyName: string } }
    | { ok: false; errors: ValidationErrorData['validationErrors'] };

async function getCompaniesCollection() {
    const db = await connectToDatabase();
    return db.db('resume').collection('companies');
}

function validateCompanyFields(formData: FormData): Validation {
    const code = formData.get('code');
    const name = formData.get('name');
    const errors: ValidationErrorData['validationErrors'] = {};

    if (typeof code !== 'string') {
        errors.code = 'companyCodeInvalidType';
    } else if (code.trim().length !== 4) {
        errors.code = 'companyCodeInvalidLength';
    }

    if (typeof name !== 'string') {
        errors.name = 'companyNameInvalidType';
    }

    if (Object.keys(errors).length === 0)
        return {
            ok: true,
            fields: {
                companyCode: (code as string).trim(),
                companyName: (name as string).trim(),
            },
        };

    return { ok: false, errors: errors };
}

export async function authorizeCompany(request: Request, formData: FormData) {
    const action = new ActionHandler(ActionType.COMPANY_REGISTRATION);
    const validation = validateCompanyFields(formData);

    if (!validation.ok) {
        return action.sendValidationError(validation.errors);
    }

    const {
        fields: { companyCode, companyName },
    } = validation;

    try {
        const { token, encryptedPassword } = createToken(companyCode);
        const companyData: DbCompanyData = {
            expiresAt: new Date(Date.now() + COMPANY_AUTHORIZATION_TIME_MS),
            code: companyCode,
            password: encryptedPassword,
        };

        if (companyName) {
            companyData.name = companyName;
        }

        const [collection, userSession] = await Promise.all([
            getCompaniesCollection(),
            getUserSession(request)
        ]);

        if (!userSession.isAdmin) {
            return action.sendServerError({ message: 'notAdmin' })
        }

        await collection.insertOne(companyData);

        return await action.redirectWithSuccessData({
            userSession,
            url: `${Page.RESUME}?token=${token}`
        });
    } catch (error) {
        console.log(error);

        if (error instanceof MongoServerError) {
            if (error.code === 11000) {
                return action.sendValidationError({
                    code: 'duplicatedCompanyCode',
                });
            }
        }

        return action.sendUnknownServerError();
    }
}

export async function fetchCompany({ url }: Request): Promise<CompanyData | null> {
    const { searchParams } = new URL(url);
    const token = searchParams.get('token');

    if (!token) return null;

    try {
        const { companyCode, password } = readToken(token);

        const collection = await getCompaniesCollection();
        const companyData = await collection.findOne<WithId<DbCompanyData>>({ code: companyCode });

        if (!companyData) return null;

        const { code, name, expiresAt, password: encryptedPassword } = companyData;

        if (!doPasswordsMatch(password, encryptedPassword)) return null;

        const isExpired = Date.now() > expiresAt.getTime()
        if (isExpired) return null;

        return {
            isExpired: false,
            code,
            name,
            token,
        };
    } catch (error) {
        console.log(error)

        return null;
    }
}

export async function fetchAllCompanies(): Promise<CompanyData[] | null> {
    try {
        const collection = await getCompaniesCollection();
        const companies = await collection.find<WithId<DbCompanyData>>({}).toArray();

        return companies.map(({ code, name, expiresAt, password: encryptedPassword }) => {
            return {
                isExpired: Date.now() > expiresAt.getTime(),
                code,
                name,
                token: getToken(code, encryptedPassword),
            } satisfies CompanyData
        })
    } catch (error) {
        console.log(error)

        return null;
    }
}