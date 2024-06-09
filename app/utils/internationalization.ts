import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "~/config";
import type { Locale, TFunction } from "~/types/global";

export function isSupportedLocale(value: unknown): value is Locale {
    return SUPPORTED_LOCALES.includes(value as Locale);
}

export function getLocaleFromPathname(pathname: string) {
    const [localeSegment] = pathname.split('/').filter((segment) => segment !== '');

    if (isSupportedLocale(localeSegment)) return localeSegment;

    return DEFAULT_LOCALE;
}

export function getFixedT(locale: Locale): TFunction {
    return <En = string, Pl = string>(enVersion: En, plVersion: Pl) => {
        if (plVersion === undefined) return enVersion;

        if (locale === 'pl') return plVersion;

        return enVersion;
    }
}

export function getFixedTFromPathname(pathname: string) {
    return getFixedT(getLocaleFromPathname(pathname))
}
