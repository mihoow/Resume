import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense, lazy } from 'react';
import { authorizeCompany, fetchAllCompanies, fetchCompany } from '~/services/companies.server';
import { getUserSession, handleAdminAuth, handleAdminLogout } from '~/services/userSession';

import { ActionType } from '~/config';
import Actions from '~/components/Actions/Actions';
import LanguageSwitch from '~/components/LanguageSwitch/LanguageSwitch';
import Resume from '~/components/Resume/Resume';
import { Skeleton } from '~/base/Skeleton/Skeleton';
import bem from 'bem-ts';
import { defer } from '@remix-run/node';
import { namedAction } from 'remix-utils/named-action';
import pageStyles from '../styles/cv.css';
import { useDebounce } from 'use-debounce';

const FindCompany = lazy(() => import('../components/FindCompany/FindCompany'));

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    return namedAction(formData, {
        [ActionType.ADMIN_AUTH]: () => handleAdminAuth(request, formData),
        [ActionType.ADMIN_LOGOUT]: () => handleAdminLogout(request),
        [ActionType.COMPANY_REGISTRATION]: () => authorizeCompany(request, formData),
    });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { isAdmin, actionData } = await getUserSession(request);
    const companyData = await fetchCompany(request);

    return defer({
        isAdmin,
        companyData,
        companies: isAdmin ? fetchAllCompanies() : null,
        actionData,
    });
};

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pageStyles }];

const __ = bem('CVPage');

export default function CVPage() {
    const { isAdmin, companies } = useLoaderData<typeof loader>();

    const [companyName] = useDebounce('', 100);

    return (
        <div className={__()}>
            <header className={__('Header')}>
                <LanguageSwitch />
            </header>
            <main className={__('Main')}>
                {isAdmin && (
                    <Suspense fallback={<Skeleton className={__('CompanySearchSkeleton')} />}>
                        <Await resolve={companies}>
                            {(companies) =>
                                companies && (
                                    <FindCompany
                                        companies={companies}
                                        className={__('CompanySearch')}
                                    />
                                )
                            }
                        </Await>
                    </Suspense>
                )}
                <Actions
                    className={__('Actions')}
                    isAdmin={isAdmin}
                />
                <Resume
                    className={__('Resume')}
                    companyName={companyName}
                    isAdmin={isAdmin}
                />
            </main>
        </div>
    );
}
