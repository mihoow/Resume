import { Suspense, lazy } from 'react';

import LockIcon from '~/icons/Lock';
import PrinterIcon from '~/icons/Printer';
import { component } from '~/utils/component';
import { useModalHandle } from '~/hooks/useModalHandle';
import { useTranslation } from '~/hooks/useTranslation';

const AuthModal = lazy(() => import('../AuthModal/AuthModal'));

export default component('Actions', function ({ className }) {
    const t = useTranslation();
    const authModalHandle = useModalHandle()

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
                        title={t('Print', 'Wydrukuj')}
                    >
                        <PrinterIcon />
                    </button>
                    <button
                        className={this.__('Button')}
                        type='button'
                        onClick={authModalHandle.open}
                        aria-label={t('Login', 'Zaloguj się')}
                        title={t('Login', 'Zaloguj się')}
                    >
                        <LockIcon />
                    </button>
                </div>
            </div>
            <Suspense fallback={null}>
                <AuthModal handle={authModalHandle} />
            </Suspense>
        </>
    );
});
