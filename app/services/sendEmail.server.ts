import { ActionHandler } from "./action.server";
import { ActionType } from "~/config";
import type { ServerMessageKey } from "~/data/serverMessages";
import type { ValidationErrorData } from "~/types/global";
import { getUserSession } from "./userSession";
import nodemailer from 'nodemailer';

type Validation =
    | { ok: true; fields: { email: string; topic: string; content: string; } }
    | { ok: false; errors: ValidationErrorData['validationErrors'] };

const EMAIL_REGEX = /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

function validateEmail(email: unknown): ServerMessageKey | null {
    if (typeof email !== 'string') return 'emailNotString'

    if (email.length === 0) return 'fieldRequired'

    if (email.length > 254) return 'emailInvalid'

    if (!EMAIL_REGEX.test(email)) return 'emailInvalid'

    const [userNamePart, domainPart] = email.split('@');

    if (
        userNamePart.length > 64
        || domainPart.split('.').some(({ length: partLength }) => partLength > 63)
    ) {
        return 'emailInvalid'
    }

    return null;
}

function validateTopic(topic: unknown): ServerMessageKey | null {
    if (typeof topic !== 'string') return 'topicNotString'

    if (topic.trim() === '') return 'fieldRequired'

    return null;
}

function validateContent(content: unknown): ServerMessageKey | null {
    if (typeof content !== 'string') return 'contentNotString'

    if (content.trim() === '') return 'contentRequired'

    return null;
}

function validateEmailFields(action: ActionHandler, formData: FormData): Validation {
    const email = formData.get('email')
    const topic = formData.get('topic')
    const content = formData.get('content')

    const emailError = validateEmail(email)
    const topicError = validateTopic(topic)
    const contentError = validateContent(content)

    const errors: ValidationErrorData['validationErrors'] = {}

    if (emailError) {
        errors.email = emailError
    }

    if (topicError) {
        errors.topic = topicError
    }

    if (contentError) {
        errors.content = contentError;
    }

    if (Object.keys(errors).length > 0) {
        return {
            ok: false,
            errors
        }
    }

    return {
        ok: true,
        fields: { email: email as string, topic: topic as string, content: content as string }
    }
}

export async function sendEmail(request: Request, formData: FormData) {
    const action = new ActionHandler(request, ActionType.SEND_EMAIL)
    const userSession = await getUserSession(request);

    const validation = validateEmailFields(action, formData)

    if (!validation.ok) {
        const { errors } = validation

        if ('content' in errors) {
            return action.redirectWithServerError({ userSession, message: errors.content })
        }

        return action.redirectWithValidationError({ userSession, validationErrors: errors })
    }

    const { fields: { email, topic, content } } = validation

    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'm1998.wieczorek@gmail.com',
                pass: import.meta.env.VITE_GMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: email,
            to: 'm1998.wieczorek@gmail.com',
            subject: `Resume | ${ topic }`,
            html: content
        })

        return action.redirectWithSuccess({ userSession, message: 'emailSent' })
    } catch (error) {
        return action.redirectWithUnknownError({ userSession })
    }
}
