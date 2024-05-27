import type { ActionData, ServerErrorData, SuccessActionData, ValidationErrorData } from '~/types/global';

import type { TypedResponse } from '@remix-run/node';
import { json } from '@remix-run/node';

type ResponseArgs<T extends ActionData> = Omit<T, 'intent' | 'ok'>;

export class ActionHandler {
    intent: string;

    constructor(intent: string) {
        this.intent = intent;
    }

    sendSuccessData(
        { message, messageBody }: ResponseArgs<SuccessActionData>,
        headers?: HeadersInit
    ): TypedResponse<SuccessActionData> {
        return json(
            {
                intent: this.intent,
                ok: true,
                message,
                messageBody,
            },
            { status: 200, headers }
        );
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
                messageBody: 'unknownServerErrorBody'
            },
            { status: 500, headers }
        );
    }
}
