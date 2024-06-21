import { Alert } from '~/base/Alert/Alert';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

export default component('CoverLetterPage', function () {
    const t = useTranslation();

    return (
        <Alert
            color='info'
            title={t('Page under development', 'Strona w budowie')}
        />
    );
});
