import { Suspense, type PropsWithChildren } from 'react';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';
import { useIsAdmin, useRootData } from '~/hooks/useRootData';
import { Skeleton } from '~/base/Skeleton/Skeleton';
import { Await } from '@remix-run/react';

const Aside = component<PropsWithChildren>('A4', function ({ className, children }) {
    return <div className={this.mcn(className)}>{children}</div>;
});

const Main = component<PropsWithChildren>('A4', function ({ className, children }) {
    const isAdmin = useIsAdmin();
    const company = useRootData(({ company }) => company);
    const t = useTranslation();

    return (
        <Aside className={className}>
            {children}
            <Suspense
                fallback={
                    <Skeleton
                        className={this.__('FooterSkeleton')}
                        count={1.9}
                    />
                }
            >
                <Await resolve={company}>
                    {(company) => {
                        if (!isAdmin && !company) return null;

                        const companyName = company?.name;

                        const consent = (() => {
                            if (!companyName) {
                                return t(
                                    'I hereby give consent for my personal data to be processed for the purpose of conducting recruitment for the position for which I am applying.',
                                    'Wyrażam zgodę na przetwarzanie moich danych osobowych w celu prowadzenia rekrutacji na aplikowane przeze mnie stanowisko.'
                                );
                            }

                            return t(
                                `I hereby give consent for my personal data to be processed by ${companyName} for the purpose of conducting recruitment for the position for which I am applying.`,
                                `Wyrażam zgodę na przetwarzanie moich danych osobowych przez ${companyName} w celu prowadzenia rekrutacji na aplikowane przeze mnie stanowisko.`
                            );
                        })();

                        return (
                            <footer className={this.__('Footer')}>
                                <span className={this.__('Consent')}>{consent}</span>
                            </footer>
                        );
                    }}
                </Await>
            </Suspense>
        </Aside>
    );
});

export default {
    Aside,
    Main,
};
