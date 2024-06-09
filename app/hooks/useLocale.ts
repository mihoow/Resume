import type { Locale } from '~/types/global';
import { getLocaleFromPathname } from '~/utils/internationalization';
import { useLocation } from '@remix-run/react';

export function useLocale(): Locale {
    const { pathname } = useLocation();

    return getLocaleFromPathname(pathname)
}
