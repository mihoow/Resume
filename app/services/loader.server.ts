import { DEFAULT_LOCALE, Page, SUPPORTED_LOCALES } from "~/config";

import type { Locale } from "~/types/global";
import { redirect } from "@remix-run/node";

export function isHomePage(pathname: string) {
    const segments = pathname.split('/').filter((segment) => segment)

    if (segments.length === 0) return true;

    if (segments.length === 1) {
        return SUPPORTED_LOCALES.includes(segments[0] as Locale)
    }

    return false
}

export function redirectToResume(searchParams: URLSearchParams, lang: string) {
    const search = searchParams.toString()

    const redirectUrl = lang === DEFAULT_LOCALE
        ? Page.RESUME
        : `/${lang}${Page.RESUME}`

    return redirect(search ? `${redirectUrl}?${search}` : redirectUrl)
}