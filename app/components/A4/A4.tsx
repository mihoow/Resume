import { type PropsWithChildren } from 'react';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';
import { useIsAdmin, useRootData } from '~/hooks/useRootData';

const Page = component<PropsWithChildren<{ type?: 'aside' | 'main' }>>('A4', function ({ className, type = 'aside', children }) {
    return <div className={this.cn(this.__([type]), className)}>{children}</div>;
});

const Main = component<PropsWithChildren>('A4', function ({ className, children }) {
    const t = useTranslation();
    const isAdmin = useIsAdmin();
    const company = useRootData(({ company }) => company);

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
        <Page type='main' className={className}>
            {children}
            {(isAdmin || company) && (
                <footer className={this.__('Footer')}>
                    <span className={this.__('Consent')}>{consent}</span>
                </footer>
            )}
        </Page>
    );
});

export default {
    Aside: Page,
    Main,
};
