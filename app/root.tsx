import type {
    ActionFunctionArgs,
    LinksFunction,
    LoaderFunctionArgs,
    MetaFunction,
    TypedDeferredData,
} from '@remix-run/node';
import { ActionType, DEFAULT_LOCALE } from './config';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import { authorizeCompany, fetchAllCompanies, fetchCompany } from './services/companies.server';
import { getUserSession, handleAdminAuth, handleAdminLogout } from './services/userSession';
import { isHomePage, redirectToResume } from './services/loader.server';

import { App } from './components/App/App';
import MediaProvider from './base/Media/Media.provider';
import type { RootData } from './types/global';
import { RootDataProvider } from './components/RootDataProvider/RootData.provider';
import { ToastListProvider } from './base/Toast/ToastList.provider';
import { component } from './utils/component';
import { defer } from '@remix-run/node';
import { fetchSensitiveAuthorInfo } from './services/authorInfo.server';
import { isSupportedLocale } from './utils/internationalization';
import { namedAction } from 'remix-utils/named-action';
import rootStyles from '~/styles/root.css';
import { sendEmail } from './services/sendEmail.server';
import { setup as setupBem } from 'bem-ts';
import { useLocale } from './hooks/useLocale';

setupBem({
    elementDelimiter: '_',
    modifierDelimiter: '-',
    strict: false,
});

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    return namedAction(formData, {
        [ActionType.ADMIN_AUTH]: () => handleAdminAuth(request, formData),
        [ActionType.ADMIN_LOGOUT]: () => handleAdminLogout(request),
        [ActionType.COMPANY_REGISTRATION]: () => authorizeCompany(request, formData),
        [ActionType.SEND_EMAIL]: () => sendEmail(formData),
    });
};

export const loader = async ({
    request,
    request: { url },
    params: { lang = DEFAULT_LOCALE },
}: LoaderFunctionArgs): Promise<TypedDeferredData<RootData>> => {
    if (!isSupportedLocale(lang)) {
        throw new Response(`The requested language (${lang}) is not supported`, { status: 404 });
    }

    const { pathname, searchParams } = new URL(url);
    /*
        I would like to have a resume page as a homepage
        but I cannot make it work because of this issue: https://github.com/remix-run/remix/issues/2498

        The above issue also prevents me from adding a home route at all
        With it, no action works (405 Not Allowed)

        I wasn't able to find any workaround
    */
    if (isHomePage(pathname)) throw redirectToResume(searchParams, lang);

    const [{ isAdmin, actionData }, company] = await Promise.all([getUserSession(request), fetchCompany(request)]);

    return defer({
        isAdmin,
        company,
        allCompanies: isAdmin ? fetchAllCompanies() : null,
        sensitiveAuthorInfo: isAdmin || company ? fetchSensitiveAuthorInfo() : null,
        actionData,
    });
};

export const meta: MetaFunction = () => [{ title: 'Wieczorek' }];

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: rootStyles },
    { rel: 'icon', type: 'image/x-icon', sizes: '16x15', href: '/logos/logo_16.ico' },
    { rel: 'icon', type: 'image/x-icon', sizes: '32x29', href: '/logos/logo_32.ico' },
    { rel: 'preload', type: 'image/svg+xml', href: '/logos/m.svg' }
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
