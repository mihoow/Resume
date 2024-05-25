import type { Locale } from "~/types/global";
import { SUPPORTED_LOCALES } from "~/config";

export function isSupportedLocale(value: unknown): value is Locale {
    return SUPPORTED_LOCALES.includes(value as Locale);
}
