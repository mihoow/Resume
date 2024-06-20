import type { ActionData, ServerErrorData, SuccessActionData, ValidationErrorData } from '~/types/global';
import { json, redirect } from '@remix-run/node';

import { Page } from '~/config';
import type { TypedResponse } from '@remix-run/node';
import type { getUserSession } from './userSession';
import { redirectBack } from 'remix-utils/redirect-back';

type UserSessionType = Awaited<ReturnType<typeof getUserSession>>;

type BaseResponseArgs = {
    userSession?: UserSessionType;
};

type BaseRedirectArgs = {
    userSession: UserSessionType;
    url?: string;
};

type ResponseArgs<T extends ActionData> = Omit<T, 'intent' | 'ok'> & BaseResponseArgs;

type RedirectArgs<T extends ActionData> = ResponseArgs<T> & BaseRedirectArgs;


export class ActionHandler {
    request: Request;

    intent: string;

    constructor(request: Request, intent: string, ) {
        this.request = request;
        this.intent = intent;
    }

    private async mergeHeaders(userSession?: UserSessionType, userHeaders?: HeadersInit): Promise<HeadersInit> {
        const headers: Record<string, string> = {};

        if (userSession) {
            headers['Set-Cookie'] = await userSession.commit();
        }

        if (!userHeaders) return headers;

        return {
            ...headers,
            ...userHeaders,
        };
    }

    private async mergeRedirectHeaders<T extends ActionData>(
        userSession: UserSessionType,
        data: T,
        userHeaders: HeadersInit = {}
    ): Promise<HeadersInit> {
        userSession.flashData(data);

        return {
            'Set-Cookie': await userSession.commit(),
            ...userHeaders,
        };
    }

    private success({ message, messageBody }: ResponseArgs<SuccessActionData>): SuccessActionData {
        return {
            intent: this.intent,
            ok: true,
            message,
            messageBody,
        };
    }

    private validationError({ validationErrors }: ResponseArgs<ValidationErrorData>): ValidationErrorData {
        return {
            intent: this.intent,
            ok: false,
            validationErrors,
        };
    }

    private serverError({ message, messageBody }: ResponseArgs<ServerErrorData>): ServerErrorData {
        return {
            intent: this.intent,
            ok: false,
            message,
            messageBody,
        };
    }

    private unknownServerError(): ServerErrorData {
        return this.serverError({
            message: 'unknownServerError',
            messageBody: 'unknownServerErrorBody',
        });
    }

    private redirect(headers: HeadersInit, url?: string) {
        if (url) {
            return redirect(url, { headers })
        }

        return redirectBack(this.request, { fallback: Page.RESUME, headers })
    }

    async sendSuccessData(
        { userSession, message, messageBody }: ResponseArgs<SuccessActionData>,
        headers?: Record<string, string>
    ): Promise<TypedResponse<SuccessActionData>> {
        return json(this.success({ message, messageBody }), {
            status: 200,
            headers: await this.mergeHeaders(userSession, headers),
        });
    }

    async redirectWithSuccess(
        { userSession, url, message, messageBody }: RedirectArgs<SuccessActionData>,
        userHeaders?: Record<string, string>
    ) {
        return this.redirect(
            await this.mergeRedirectHeaders(userSession, this.success({ message, messageBody }), userHeaders),
            url
        )
    }

    async sendValidationError(
        { userSession, validationErrors }: ResponseArgs<ValidationErrorData>,
        headers?: HeadersInit
    ): Promise<TypedResponse<ValidationErrorData>> {
        return json(this.validationError({ validationErrors }), {
            status: 400,
            headers: await this.mergeHeaders(userSession, headers),
        });
    }

    async redirectWithValidationError(
        { userSession, url, validationErrors }: RedirectArgs<ValidationErrorData>,
        headers?: HeadersInit
    ): Promise<TypedResponse<ValidationErrorData>> {
        return this.redirect(
            await this.mergeRedirectHeaders(userSession, this.validationError({ validationErrors }), headers),
            url
        )
    }

    async sendServerError(
        { userSession, message, messageBody }: ResponseArgs<ServerErrorData>,
        headers?: HeadersInit
    ): Promise<TypedResponse<ServerErrorData>> {
        return json(this.serverError({ message, messageBody }), {
            status: 500,
            headers: await this.mergeHeaders(userSession, headers),
        });
    }

    async redirectWithServerError(
        { userSession, url, message, messageBody }: RedirectArgs<ServerErrorData>,
        headers?: HeadersInit
    ): Promise<TypedResponse<ValidationErrorData>> {
        return this.redirect(
            await this.mergeRedirectHeaders(userSession, this.serverError({ message, messageBody }), headers),
            url
        );
    }

    async sendUnknownServerError(
        { userSession }: BaseResponseArgs = {},
        headers?: HeadersInit
    ): Promise<TypedResponse<ServerErrorData>> {
        return json(this.unknownServerError(), { status: 500, headers: await this.mergeHeaders(userSession, headers) });
    }

    async redirectWithUnknownError({ userSession, url }: BaseRedirectArgs, headers?: HeadersInit) {
        return this.redirect(
            await this.mergeRedirectHeaders(userSession, this.unknownServerError(), headers),
            url
        );
    }
}
