import { ActionType, COMPANY_AUTHORIZATION_TIME_MS, Page } from '~/config';
import type { AuthStatus, CompanyData, DbCompanyData, ValidationErrorData } from '~/types/global';
import { createToken, doPasswordsMatch, getToken, readToken } from './authToken.server';

import { ActionHandler } from './action.server';
import { MongoServerError } from 'mongodb';
import type { WithId } from 'mongodb';
import { connectToDatabase } from './db.server';
import { getUserSession } from './userSession';

type Validation =
    | { ok: true; fields: { companyCode: string; companyName: string; jobPosition: string | null } }
    | { ok: false; errors: ValidationErrorData['validationErrors'] };

async function getCompaniesCollection() {
    const db = await connectToDatabase();
    return db.db('resume').collection('companies');
}

function validateCompanyFields(formData: FormData): Validation {
    const code = formData.get('code');
    const name = formData.get('name');
    const jobPosition = formData.get('jobPosition');

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
                jobPosition: jobPosition ? String(jobPosition).trim() : null
            },
        };

    return { ok: false, errors: errors };
}

export async function authorizeCompany(request: Request, formData: FormData) {
    const action = new ActionHandler(request, ActionType.COMPANY_REGISTRATION);
    const userSession = await getUserSession(request);

    const validation = validateCompanyFields(formData);

    if (!validation.ok) {
        return action.redirectWithValidationError({ userSession, validationErrors: validation.errors });
    }

    const {
        fields: { companyCode, companyName, jobPosition },
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

        if (jobPosition) {
            companyData.jobPosition = jobPosition;
        }

        const [collection, userSession] = await Promise.all([getCompaniesCollection(), getUserSession(request)]);

        if (!userSession.isAdmin) {
            return action.sendServerError({ message: 'notAdmin' });
        }

        await collection.insertOne(companyData);

        return await action.redirectWithSuccess({
            userSession,
            url: `${Page.RESUME}?token=${token}`,
        });
    } catch (error) {
        console.log(error);

        if (error instanceof MongoServerError) {
            if (error.code === 11000) {
                return action.redirectWithValidationError({
                    userSession,
                    validationErrors: { code: 'duplicatedCompanyCode' },
                });
            }
        }

        return action.sendUnknownServerError();
    }
}

export function isCompanyExpired({ expiresAt }: DbCompanyData) {
    return Date.now() > expiresAt.getTime();
}

export async function fetchCompany({ url }: Request): Promise<{ status: AuthStatus; data: CompanyData | null }> {
    const { searchParams } = new URL(url);
    const token = searchParams.get('token');

    if (!token) {
        return {
            status: 'no-token',
            data: null,
        };
    }

    if (token === 'public') {
        return {
            status: 'public-access',
            data: null,
        };
    }

    try {
        const { companyCode, password } = readToken(token);

        const collection = await getCompaniesCollection();
        const companyData = await collection.findOne<WithId<DbCompanyData>>({ code: companyCode });

        if (!companyData || !doPasswordsMatch(password, companyData.password))
            return {
                status: 'invalid-token',
                data: null,
            };

        const { code, name, jobPosition } = companyData;
        const isExpired = isCompanyExpired(companyData);

        if (isExpired)
            return {
                status: 'expired-token',
                data: null,
            };

        return {
            status: 'ok',
            data: {
                isExpired: false,
                code,
                name,
                jobPosition,
                token,
            },
        };
    } catch (error) {
        console.log(error);

        return { status: 'server-error', data: null };
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
            } satisfies CompanyData;
        });
    } catch (error) {
        console.log(error);

        return null;
    }
}
