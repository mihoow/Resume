import { Suspense, type PropsWithChildren, lazy } from 'react';
import { component } from '~/utils/component';
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';
import { Skeleton } from '~/base/Skeleton/Skeleton';
import { Await } from '@remix-run/react';
import Actions from '../Actions/Actions';
import { useIsAdmin, useRootData } from '~/hooks/useRootData';

const FindCompany = lazy(() => import('../FindCompany/FindCompany'));

export const App = component<PropsWithChildren>('App', function ({ children }) {
    const isAdmin = useIsAdmin();
    const allCompanies = useRootData(({ allCompanies }) => allCompanies);

    return (
        <div className={this.mcn()}>
            <header className={this.__('Header')}>
                <LanguageSwitch />
            </header>
            <main className={this.__('Main')}>
                {isAdmin && (
                    <Suspense fallback={<Skeleton className={this.__('CompanySearchSkeleton')} />}>
                        <Await resolve={allCompanies}>
                            {(companies) =>
                                companies && (
                                    <FindCompany
                                        companies={companies}
                                        className={this.__('CompanySearch')}
                                    />
                                )
                            }
                        </Await>
                    </Suspense>
                )}
                <Actions className={this.__('Actions')} />
                {children}
            </main>
        </div>
    );
});
