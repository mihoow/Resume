import PrinterIcon from '~/icons/Printer';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

export default component('Actions', function ({ className }) {
    const t = useTranslation();

    const handlePrint = () => {
        window.print();
    };

    return (
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
            </div>
        </div>
    );
});
