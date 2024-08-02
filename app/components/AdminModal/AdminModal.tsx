import { useId, useState } from 'react';

import { ActionType } from '~/config';
import { Form } from '~/base/Forms/Form';
import { FORM_DEFAULT_CONTEXT, FormContext, type FormContextType } from '~/base/Forms/Form.context';
import { Label } from '~/base/Forms/Label';
import Modal from '~/base/Modal';
import type { ModalHandle } from '~/types/global';
import { Submit } from '~/base/Forms/Submit';
import { TextInput } from '~/base/Forms/TextInput';
import { component } from '~/utils/component';

/*
    Since it's going to be seen only be myself, no translations here
*/

export const AdminModal = component<{ handle: ModalHandle }>('AdminModal', function ({ className, handle }) {
    const authorizationFormId = useId();
    const [formContext, setFormContext] = useState<FormContextType>(FORM_DEFAULT_CONTEXT);

    return (
        <Modal
            show={handle.isOpen}
            onClose={handle.close}
            className={this.mcn(className)}
        >
            <Modal.Header>Authorize a company</Modal.Header>
            <FormContext.Provider value={formContext}>
                <Modal.Body className={this.__('Body')}>
                    <Label value='Company code:'>
                        <TextInput
                            form={authorizationFormId}
                            name='code'
                            type='text'
                            required
                            minLength={4}
                            maxLength={4}
                            className={this.__('CodeInput')}
                        />
                    </Label>
                    <Label value='Company name:'>
                        <TextInput
                            form={authorizationFormId}
                            name='name'
                            type='text'
                        />
                    </Label>
                    <Label value='Job position:'>
                        <TextInput
                            form={authorizationFormId}
                            name='jobPosition'
                            type='text'
                        />
                    </Label>
                </Modal.Body>
            </FormContext.Provider>
            <Modal.Footer className={this.__('Footer')}>
                <Form
                    intent={ActionType.ADMIN_LOGOUT}
                    method='POST'
                    preventScrollReset
                    onSuccess={handle.close}
                >
                    <Submit variant='danger'>Logout</Submit>
                </Form>
                <Form
                    id={authorizationFormId}
                    intent={ActionType.COMPANY_REGISTRATION}
                    method='POST'
                    preventScrollReset
                    onSuccess={handle.close}
                    onContextChange={setFormContext}
                >
                    <Submit variant='submit'>Authorize</Submit>
                </Form>
            </Modal.Footer>
        </Modal>
    );
});

export default AdminModal;
