import type { ServerMessageKey } from "~/data/serverMessages";

export type Locale = 'en' | 'pl';

export type AppLayout = 'a4' | 'wide';

export type RouteHandle = {
    appLayout?: AppLayout;
};

export type Author = {
    profileImage: string;
    birthday: string;
    github: string;
    linkedin: string;
};

export type SensitiveAuthorInfo = {
    identifier: 'sensitive-author-info';
    email: string;
    phone: {
        code: number;
        tel: number;
    }
    address: string;
    addressLink: string;
}

export type DbCompanyData = {
    expiresAt: Date;
    code: string;
    name?: string;
    jobPosition?: string;
    password: string;
}

export type CompanyData = {
    isExpired: boolean;
    code: string;
    name?: string;
    jobPosition?: string;
    token: string;
}

export type AuthStatus =
    | 'no-token'
    | 'public-access'
    | 'server-error'
    | 'invalid-token'
    | 'expired-token'
    | 'ok';

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

export type RootData = {
    isAdmin: boolean;
    company: CompanyData | null;
    authStatus: AuthStatus;
    allCompanies: Promise<CompanyData[] | null> | null;
    sensitiveAuthorInfo: Promise<SensitiveAuthorInfo | null> | null;
    actionData: ActionData | undefined;
};
