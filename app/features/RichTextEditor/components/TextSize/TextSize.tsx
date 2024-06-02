import type { TextSize } from '../../type';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

export const TextSizeSample = component<{ size: TextSize }>('TextSizeSample', function ({ className, size }) {
    const t = useTranslation();

    const text = (() => {
        switch (size) {
            case 'sm':
                return t('Small', 'Mały');
            case 'md':
                return t('Normal', 'Normalny');
            case 'lg':
                return t('Big', 'Duży');
            case 'xl':
                return t('Huge', 'Wielki');
        }
    })();

    return <span className={this.cn(this.__([size]), className)}>{text}</span>;
});
