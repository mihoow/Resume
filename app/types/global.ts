
export type Locale = 'en' | 'pl';

export type Namespace = 'base' | 'cv';

export type GlobalData = {
    locale: Locale;
};

export type TFunction<En = string, Pl = string> = (enVersion: En, plVersion?: Pl) => En | Pl;

export type DataFunctionArgs = { t: TFunction; };