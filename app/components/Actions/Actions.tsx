import { Suspense, lazy } from 'react';

import { KeyIcon } from '~/icons/Key';
import LockIcon from '~/icons/Lock';
import PrinterIcon from '~/icons/Printer';
import { component } from '~/utils/component';
import { useIsAdmin } from '~/hooks/useRootData';
import { useModalHandle } from '~/hooks/useModalHandle';
import { useTranslation } from '~/hooks/useTranslation';

const AuthModal = lazy(() => import('../AuthModal/AuthModal'));
const AdminModal = lazy(() => import('../AdminModal/AdminModal'));

const AdminManageAction = component('AdminManageAction', function ({ className }) {
    const t = useTranslation();
    const adminModalHandle = useModalHandle();

    return (
        <>
            <button
                className={className}
                type='button'
                onClick={adminModalHandle.open}
                aria-label={t('Manage', 'Zarządzaj')}
            >
                <LockIcon />
            </button>
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
            <button
                className={className}
                type='button'
                onClick={authModalHandle.open}
                aria-label={t('Login', 'Zaloguj się')}
            >
                <KeyIcon />
            </button>
            <Suspense fallback={null}>
                <AuthModal handle={authModalHandle} />
            </Suspense>
        </>
    );
});

export default component('Actions', function ({ className }) {
    const isAdmin = useIsAdmin()
    const t = useTranslation();

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <div className={this.mcn(className)}>
                <div className={this.__('ActionBar')}>
                    <button
                        className={this.__('Button')}
                        type='button'
                        onClick={handlePrint}
                        aria-label={t('Print', 'Wydrukuj')}
                    >
                        <PrinterIcon />
                    </button>
                    {isAdmin ? (
                        <AdminManageAction className={this.__('Button')} />
                    ) : (
                        <AuthAuthAction className={this.__('Button')} />
                    )}
                </div>
            </div>
        </>
    );
});
