import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';

import { DEFAULT_LOCALE } from './config';
import MediaProvider from '~/base/Media/Media.provider';
import { isSupportedLocale } from './utils/internationalization';
import rootStyles from '~/styles/root.css';
import { setup as setupBem } from 'bem-ts';
import { useLocale } from './hooks/useLocale';

setupBem({
    elementDelimiter: '_',
    modifierDelimiter: '-',
    strict: false,
});

export const loader = async ({ params: { lang = DEFAULT_LOCALE } }: LoaderFunctionArgs) => {
    if (!isSupportedLocale(lang)) {
        throw new Response(`The requested language (${lang}) is not supported`, { status: 404 });
    }

    return null;
};

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: rootStyles }];

export default function Root() {
    const locale = useLocale();

    return (
        <html
            lang={locale}
            dir='ltr'
            data-lang={locale}
        >
            <head>
                <meta charSet='utf-8' />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <Meta />
                <Links />
            </head>
            <body>
                <MediaProvider>
                    <Outlet />
                </MediaProvider>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
