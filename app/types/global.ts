import type { ServerMessageKey } from "~/data/serverMessages";

export type Locale = 'en' | 'pl';

export type Namespace = 'base' | 'cv';

export type DbCompanyData = {
    expiresAt: Date;
    code: string;
    name?: string;
    password: string;
}

export type CompanyData = {
    isExpired: boolean;
    code: string;
    name?: string;
    token: string;
}

export type GlobalData = {
    locale: Locale;
};

export type TFunction<En = string, Pl = string> = (enVersion: En, plVersion?: Pl) => En | Pl;

export type DataFunctionArgs = { t: TFunction };

export type ModalHandle = {
    isOpen: boolean;
    open: VoidFunction;
    close: VoidFunction;
};

export type SuccessActionData = {
    intent: string;
    ok: true;
    message?: ServerMessageKey;
    messageBody?: ServerMessageKey
}

export type ValidationErrorData = {
    intent: string;
    ok: false;
    validationErrors: Record<string, ServerMessageKey>;
}

export type ServerErrorData = {
    intent: string;
    ok: false;
    message?: ServerMessageKey;
    messageBody?: ServerMessageKey
}

export type ActionData = SuccessActionData | ValidationErrorData | ServerErrorData;
