import { ComponentPropsWithoutRef, PropsWithChildren, Suspense, lazy } from 'react';
import { useContactHandle, useModalHandle } from '~/hooks/useModalHandle';

import { ActionType } from '~/config';
import { EnvelopeAtIcon } from '~/icons/EnvelopeAt';
import { KeyIcon } from '~/icons/Key';
import LockIcon from '~/icons/Lock';
import PrinterIcon from '~/icons/Printer';
import Tooltip from '~/base/Tooltip';
import { component } from '~/utils/component';
import { useBreakpoints } from '~/hooks/useBreakpoints';
import { useIsAdmin } from '~/hooks/useRootData';
import { useTranslation } from '~/hooks/useTranslation';

const AuthModal = lazy(() => import('../AuthModal/AuthModal'));
const AdminModal = lazy(() => import('../AdminModal/AdminModal'));
const SendEmailModal = lazy(() => import('../../features/RichTextEditor/components/SendEmailModal/SendEmailModal'));

const ActionButton = component<PropsWithChildren<{ label: string }> & ComponentPropsWithoutRef<'button'>>(
    'ActionButton',
    function ({ className, label, children, ...props }) {
        const isDesktop = useBreakpoints({ min: 'desktop' })

        return (
            <Tooltip
                placement={isDesktop ? 'left' : 'top'}
                content={label}
                theme='light'
            >
                <button
                    className={this.mcn(className)}
                    type='button'
                    aria-label={label}
                    {...props}
                >
                    {children}
                </button>
            </Tooltip>
        );
    }
);

const AdminManageAction = component('AdminManageAction', function ({ className }) {
    const t = useTranslation();
    const adminModalHandle = useModalHandle();

    return (
        <>
            <ActionButton
                className={className}
                label={t('Manage', 'Zarządzaj')}
                onClick={adminModalHandle.open}
            >
                <LockIcon />
            </ActionButton>
            <Suspense fallback={null}>
                <AdminModal handle={adminModalHandle} />
            </Suspense>
        </>
    );
});

const AuthAuthAction = component('AuthModalAction', function ({ className }) {
    const t = useTranslation();
    const authModalHandle = useModalHandle();

    return (
        <>
            <ActionButton
                className={className}
                label={t('Login as admin', 'Zaloguj się jako administrator')}
                onClick={authModalHandle.open}
            >
                <KeyIcon />
            </ActionButton>
            <Suspense fallback={null}>
                <AuthModal handle={authModalHandle} />
            </Suspense>
        </>
    );
});

const SendEmailAction = component('SendEmailAction', function ({ className }) {
    const t = useTranslation();
    const contactModalHandler = useContactHandle();

    return (
        <>
            <ActionButton
                label={t('Send me an e-mail', 'Wyślij do mnie e-mail')}
                className={className}
                onClick={contactModalHandler.open}
            >
                <EnvelopeAtIcon />
            </ActionButton>
            <Suspense fallback={null}>
                <SendEmailModal />
            </Suspense>
        </>
    );
});

export default component('Actions', function ({ className }) {
    const isAdmin = useIsAdmin();
    const t = useTranslation();

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <div className={this.mcn(className)}>
                <div className={this.__('ActionBar')}>
                    <ActionButton
                        className={this.__('Button')}
                        label={t('Print / Download', 'Wydrukuj / Pobierz')}
                        onClick={handlePrint}
                    >
                        <PrinterIcon />
                    </ActionButton>
                    {isAdmin ? (
                        <AdminManageAction className={this.__('Button')} />
                    ) : (
                        <AuthAuthAction className={this.__('Button')} />
                    )}
                    <SendEmailAction className={this.__('Button')} />
                </div>
            </div>
        </>
    );
});
