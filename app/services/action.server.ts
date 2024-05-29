import type { ActionData, ServerErrorData, SuccessActionData, ValidationErrorData } from '~/types/global';
import { json, redirect } from '@remix-run/node';

import type { TypedResponse } from '@remix-run/node';
import type { getUserSession } from './userSession';

type ResponseArgs<T extends ActionData> = Omit<T, 'intent' | 'ok'>;
type RedirectArgs<T extends ActionData> = ResponseArgs<T> & {
    userSession: Awaited<ReturnType<typeof getUserSession>>;
    url: string;
};

export class ActionHandler {
    intent: string;

    constructor(intent: string) {
        this.intent = intent;
    }

    private success({ message, messageBody }: ResponseArgs<SuccessActionData>): SuccessActionData {
        return {
            intent: this.intent,
            ok: true,
            message,
            messageBody,
        };
    }

    sendSuccessData(
        { message, messageBody }: ResponseArgs<SuccessActionData>,
        headers?: HeadersInit
    ): TypedResponse<SuccessActionData> {
        return json(this.success({ message, messageBody }), { status: 200, headers });
    }

    async redirectWithSuccessData({ userSession, url, message, messageBody }: RedirectArgs<SuccessActionData>) {
        userSession.flashData(this.success({ message, messageBody }));

        return redirect(url, {
            headers: {
                'Set-Cookie': await userSession.commit(),
            },
        });
    }

    sendValidationError(
        validationErrors: ValidationErrorData['validationErrors'],
        headers?: HeadersInit
    ): TypedResponse<ValidationErrorData> {
        return json(
            {
                intent: this.intent,
                ok: false,
                validationErrors,
            },
            { status: 400, headers }
        );
    }

    sendServerError(
        { message, messageBody }: ResponseArgs<ServerErrorData>,
        headers?: HeadersInit
    ): TypedResponse<ServerErrorData> {
        return json(
            {
                intent: this.intent,
                ok: false,
                message,
                messageBody,
            },
            { status: 500, headers }
        );
    }

    sendUnknownServerError(headers?: HeadersInit): TypedResponse<ServerErrorData> {
        return json(
            {
                intent: this.intent,
                ok: false,
                message: 'unknownServerError',
                messageBody: 'unknownServerErrorBody',
            },
            { status: 500, headers }
        );
    }
}
