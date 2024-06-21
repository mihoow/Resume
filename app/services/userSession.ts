import { ActionType, TimeInSeconds } from '~/config';

import type { ActionData } from '~/types/global';
import { ActionHandler } from './action.server';
import type { TypedResponse } from '@remix-run/node';
import { createCookieSessionStorage } from '@remix-run/node';

type UserSession = {
    isAdmin: boolean;
};

type UserSessionFlashData = {
    actionData: ActionData;
};

const { getSession, commitSession, destroySession } = createCookieSessionStorage<UserSession, UserSessionFlashData>({
    cookie: {
        name: 'auth',
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
        secure: import.meta.env.PROD,
        secrets: [process.env.AUTH_COOKIE_SECRET],
        maxAge: TimeInSeconds.DAY,
    },
});

export async function getUserSession(request: Request) {
    const session = await getSession(request.headers.get('Cookie'));

    return {
        isAdmin: session.get('isAdmin') || false,
        actionData: session.get('actionData'),
        authenticateAdmin: () => session.set('isAdmin', true),
        logoutAdmin: () => session.set('isAdmin', false),
        commit: () => commitSession(session),
        destroy: () => destroySession(session),
        flashData: (data: ActionData) => session.flash('actionData', data),
    };
}

export async function handleAdminAuth(request: Request, formData: FormData): Promise<TypedResponse<ActionData>> {
    const action = new ActionHandler(request, ActionType.ADMIN_AUTH);
    const userSession = await getUserSession(request);

    try {
        const password = formData.get('password');

        if (!password) {
            return action.redirectWithValidationError({
                userSession,
                validationErrors: { password: 'passwordEmpty' },
            });
        }

        if (password !== process.env.ADMIN_PASSWORD) {
            return action.redirectWithValidationError({ userSession, validationErrors: { password: 'passwordIncorrect' } });
        }

        userSession.authenticateAdmin();

        return action.redirectWithSuccess({ userSession, message: 'adminAuthSuccess' });
    } catch (error) {
        console.log(error);

        return action.redirectWithUnknownError({ userSession });
    }
}

export async function handleAdminLogout(request: Request) {
    const action = new ActionHandler(request, ActionType.ADMIN_LOGOUT);
    const userSession = await getUserSession(request);

    try {
        userSession.logoutAdmin()

        return action.redirectWithSuccess({ userSession });
    } catch (error) {
        console.log(error);

        return action.redirectWithUnknownError({ userSession });
    }
}
