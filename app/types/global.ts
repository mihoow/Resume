export type Locale = 'en' | 'pl';

export type Namespace = 'base' | 'cv';

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
    message?: string;
    messageBody?: string
}

export type ValidationErrorData = {
    intent: string;
    ok: false;
    validationErrors: Record<string, string>;
}

export type ServerErrorData = {
    intent: string;
    ok: false;
    message?: string;
    messageBody?: string
}

export type ActionData = SuccessActionData | ValidationErrorData | ServerErrorData;
