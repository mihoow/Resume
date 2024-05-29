import { ActionType, TimeInSeconds } from '~/config';
import { createCookieSessionStorage, json } from '@remix-run/node';

import type { ActionData } from '~/types/global';
import { ActionHandler } from './action.server';
import type { TypedResponse } from '@remix-run/node';

type UserSession = {
    isAdmin: boolean;
};

type UserSessionFlashData = {
    actionData: ActionData;
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage<UserSession, UserSessionFlashData>({
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

export async function getUserSession(request: Request) {
    const session = await getSession(request.headers.get('Cookie'));

    return {
        isAdmin: session.get('isAdmin') || false,
        actionData: session.get('actionData'),
        authenticateAdmin: () => session.set('isAdmin', true),
        commit: () => commitSession(session),
        destroy: () => destroySession(session),
        flashData: (data: ActionData) => session.flash('actionData', data)
    };
}

export async function handleAdminAuth(request: Request, formData: FormData): Promise<TypedResponse<ActionData>> {
    const action = new ActionHandler(ActionType.ADMIN_AUTH);

    try {
        const authSession = await getUserSession(request);
        const password = formData.get('password');

        if (!password) {
            return action.sendValidationError({ password: 'passwordEmpty' });
        }

        if (password !== process.env.ADMIN_PASSWORD) {
            return action.sendValidationError({ password: 'passwordIncorrect' });
        }

        authSession.authenticateAdmin();

        return action.sendSuccessData({ message: 'adminAuthSuccess' }, { 'Set-Cookie': await authSession.commit() });
    } catch (error) {
        console.log(error);

        return action.sendUnknownServerError();
    }
}

export async function handleAdminLogout(request: Request) {
    const action = new ActionHandler(ActionType.ADMIN_LOGOUT);

    try {
        const authSession = await getUserSession(request);

        return json(null, {
            headers: { 'Set-Cookie': await authSession.destroy() },
        });
    } catch (error) {
        console.log(error);

        return action.sendUnknownServerError();
    }
}
