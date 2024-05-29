import { ActionType } from '~/config';
import { Button } from '~/base/Button/Button';
import { Form } from '~/base/Forms/Form';
import { Label } from '~/base/Forms/Label';
import Modal from '~/base/Modal';
import type { ModalHandle } from '~/types/global';
import { Submit } from '~/base/Forms/Submit';
import { TextInput } from '~/base/Forms/TextInput';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

export const AuthModal = component<{ handle: ModalHandle }>('AuthModal', function ({ className, handle }) {
    const t = useTranslation();

    return (
        <Modal
            as={Form}
            method='POST'
            intent={ActionType.ADMIN_AUTH}
            onSuccess={handle.close}
            show={handle.isOpen}
            onClose={handle.close}
            className={this.mcn(className)}
        >
            <Modal.Header>
                {t('Authenticate for admin access', 'Uwierzytelnij, aby uzyskać dostęp administratora')}
            </Modal.Header>
            <Modal.Body>
                <Label value={t('Password:', 'Hasło:')}>
                    <TextInput
                        type='password'
                        name='password'
                    />
                </Label>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type='button'
                    onClick={handle.close}
                >
                    {t('Dismiss', 'Zrezygnuj')}
                </Button>
                <Submit variant='submit'>{t('Submit', 'Zatwierdź')}</Submit>
            </Modal.Footer>
        </Modal>
    );
});

export default AuthModal;
