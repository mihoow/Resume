import { Suspense, type PropsWithChildren, lazy } from 'react';
import { component } from '~/utils/component';
import { Skeleton } from '~/base/Skeleton/Skeleton';
import { Await } from '@remix-run/react';
import Actions from '../Actions/Actions';
import { useIsAdmin, useRootData } from '~/hooks/useRootData';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { AuthAlert } from '../AuthAlert/AuthAlert';
import { DocumentTabs } from '../DocumentTabs/DocumentTabs';

const FindCompany = lazy(() => import('../FindCompany/FindCompany'));

export const App = component<PropsWithChildren>('App', function ({ children }) {
    const isAdmin = useIsAdmin();
    const allCompanies = useRootData(({ allCompanies }) => allCompanies);
    const authStatus = useRootData(({ authStatus }) => authStatus);

    return (
        <div className={this.mcn()}>
            <Header className={this.__('Header')} />
            <AuthAlert authStatus={authStatus} className={this.__('AuthAlert')} />
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
                <DocumentTabs className={this.__('DocumentTabs')} />
                <Actions className={this.__('Actions')} />
                {children}
            </main>
            <Footer className={this.__('Footer')} />
        </div>
    );
});
