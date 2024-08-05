import { DEFAULT_LOCALE, Page } from '~/config';
import { getLocaleFromPathname, isSupportedLocale } from './internationalization';

import type { Locale } from '~/types/global';
import { pipe } from './pipe';

export function getLinkToPage(pathname: string, currSearch: string, page: string) {
    const nextSearchParams = new URLSearchParams(currSearch);
    nextSearchParams.delete('contact');

    const locale = getLocaleFromPathname(pathname);

    return pipe(
        () => {
            if (locale === DEFAULT_LOCALE) return '';

            return `/${locale}`;
        },
        (link) => `${link}${page}`,
        (link) => {
            const params = nextSearchParams.toString();

            if (!params) return link;

            return `${link}?${params}`;
        }
    );
}

export function getLinkToResume(pathname: string, currSearch: string) {
    return getLinkToPage(pathname, currSearch, Page.RESUME);
}

export function getLinkToCoverLetter(pathname: string, currSearch: string) {
    return getLinkToPage(pathname, currSearch, Page.COVER_LETTER);
}

export function getLinkToAboutMe(pathname: string, currSearch: string) {
    return getLinkToPage(pathname, currSearch, Page.ABOUT_ME);
}

export function getLinkToContact(pathname: string, currSearch: string) {
    const nextSearchParams = new URLSearchParams(currSearch);
    nextSearchParams.set('contact', 'open');

    return `${pathname}?${nextSearchParams.toString()}`;
}

export function getLinkToLocale(pathname: string, currSearch: string, locale: Locale) {
    return pipe(
        () => {
            const pathnameSegments = pathname.split('/').filter((segment) => segment !== '');
            const [localeSegment] = pathnameSegments;

            if (isSupportedLocale(localeSegment)) {
                return pathnameSegments.slice(1).join('/');
            }

            return pathname;
        },
        (pathnameWithoutLocale) => {
            if (locale === DEFAULT_LOCALE) return pathnameWithoutLocale;

            return `/${locale}${pathnameWithoutLocale}`;
        },
        (localizedPathname) => {
            if (!currSearch) return localizedPathname;

            return `${localizedPathname}${currSearch}`;
        }
    );
}
