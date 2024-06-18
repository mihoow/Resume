import { IconButton } from '../IconButton/IconButton';
import { Submit } from '~/base/Forms/Submit';
import { TrashIcon } from '~/features/RichTextEditor/icons/Trash';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

export const Footer = component<{ onDismiss?: VoidFunction }>('RichTextFooter', function ({ className, onDismiss }) {
    const t = useTranslation();

    return (
        <div className={this.mcn(className)}>
            <Submit
                variant='submit'
                className={this.__('Submit')}
            >
                {t('Send', 'Wyślij')}
            </Submit>
            <IconButton
                className={this.__('Discard')}
                icon={TrashIcon}
                title={t('Close modal and discard changes', 'Zamknij modal i odrzuć zmiany')}
                onClick={onDismiss}
            />
        </div>
    );
});
