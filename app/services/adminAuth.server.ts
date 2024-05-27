import { ActionType, TimeInSeconds } from '~/config';

import type { ActionData } from '~/types/global';
import { ActionHandler } from './action.server';
import type { TypedResponse } from '@remix-run/node';
import { createCookieSessionStorage } from '@remix-run/node';

type AuthSession = {
    isAdmin: boolean;
};

const { getSession, commitSession, destroySession } = createCookieSessionStorage<AuthSession>({
    cookie: {
        name: 'auth',
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        secrets: [process.env.AUTH_COOKIE_SECRET!],
        maxAge: TimeInSeconds.DAY,
    },
});

export async function getAuthSession(request: Request) {
    const session = await getSession(request.headers.get('Cookie'));

    return {
        isAdmin: session.get('isAdmin') || false,
        authenticateAdmin: () => session.set('isAdmin', true),
        commit: () => commitSession(session),
        destroy: () => destroySession(session),
    };
}

export async function handleAdminAuth(request: Request, formData: FormData): Promise<TypedResponse<ActionData>> {
    const action = new ActionHandler(ActionType.AUTH);

    try {
        const authSession = await getAuthSession(request);
        const password = formData.get('password');

        if (!password) {
            return action.sendValidationError({ password: 'passwordEmpty' });
        }

        if (password !== process.env.ADMIN_PASSWORD) {
            return action.sendValidationError({ password: 'passwordIncorrect' });
        }

        authSession.authenticateAdmin();

        return action.sendSuccessData(
            { message: 'adminAuthSuccess' },
            { 'Set-Cookie': await authSession.commit() }
        );
    } catch (error) {
        console.log(error);

        return action.sendUnknownServerError();
    }
}
