import { DEFAULT_LOCALE } from '~/config';
import type { Locale } from '~/types/global';
import { isSupportedLocale } from '~/utils/internationalization';
import { useLocation } from '@remix-run/react';

export function useLocale(): Locale {
    const { pathname } = useLocation();

    const [localeSegment] = pathname.split('/').filter((segment) => segment !== '');

    if (isSupportedLocale(localeSegment)) return localeSegment;

    return DEFAULT_LOCALE;
}
