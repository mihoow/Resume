import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, ShouldRevalidateFunctionArgs, useLoaderData } from '@remix-run/react';
import type {
    LinksFunction,
    LoaderFunctionArgs,
    MetaFunction,
    TypedDeferredData,
} from '@remix-run/node';
import { fetchAllCompanies, fetchCompany } from './services/companies.server';

import { App } from './components/App/App';
import { DEFAULT_LOCALE } from './config';
import MediaProvider from './base/Media/Media.provider';
import type { RootData } from './types/global';
import { RootDataProvider } from './components/RootDataProvider/RootData.provider';
import { ToastListProvider } from './base/Toast/ToastList.provider';
import { component } from './utils/component';
import { defer } from '@remix-run/node';
import { fetchSensitiveAuthorInfo } from './services/authorInfo.server';
import { getUserSession } from './services/userSession';
import { isSupportedLocale } from './utils/internationalization';
import rootStyles from '~/styles/root.css';
import { setup as setupBem } from 'bem-ts';
import { useLocale } from './hooks/useLocale';

setupBem({
    elementDelimiter: '_',
    modifierDelimiter: '-',
    strict: false,
});

export const shouldRevalidate = ({ currentUrl, nextUrl, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) => {
    const { searchParams: currentSearchParams } = new URL(currentUrl)
    const { searchParams: nextSearchParams } = new URL(nextUrl)

    if (currentSearchParams.get('contact') !== nextSearchParams.get('contact')) return false;

    return defaultShouldRevalidate;
}


export const loader = async ({
    request,
    params: { lang = DEFAULT_LOCALE },
}: LoaderFunctionArgs): Promise<TypedDeferredData<RootData>> => {
    if (!isSupportedLocale(lang)) {
        throw new Response(`The requested language (${lang}) is not supported`, { status: 404 });
    }

    const [userSession, { status: authStatus, data: company }] = await Promise.all([getUserSession(request), fetchCompany(request)]);
    const { isAdmin, actionData } = userSession

    return defer({
        isAdmin,
        company,
        authStatus,
        allCompanies: isAdmin ? fetchAllCompanies() : null,
        sensitiveAuthorInfo: isAdmin || company ? fetchSensitiveAuthorInfo() : null,
        actionData,
    }, {
        headers: {
            'Set-Cookie': await userSession.commit()
        }
    });
};

export const meta: MetaFunction = () => [{ title: 'Wieczorek' }];

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: rootStyles },
    { rel: 'icon', type: 'image/x-icon', sizes: '16x15', href: '/logos/logo_16.ico' },
    { rel: 'icon', type: 'image/x-icon', sizes: '32x29', href: '/logos/logo_32.ico' },
    { rel: 'preload', as: 'image', type: 'image/svg+xml', href: '/logos/m.svg' }
];

export default component('Root', function () {
    const loaderData = useLoaderData<typeof loader>();
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
                <meta
                    name='robots'
                    content='noindex, nofollow'
                />
                <Meta />
                <Links />
            </head>
            <body>
                <RootDataProvider data={loaderData as RootData}>
                    <MediaProvider>
                        <ToastListProvider>
                            <App>
                                <Outlet />
                            </App>
                        </ToastListProvider>
                    </MediaProvider>
                </RootDataProvider>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
});
