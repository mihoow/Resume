import { FormEvent, useRef } from 'react';

import { Button } from '~/base/Button/Button';
import { Label } from '~/base/Forms/Label';
import Modal from '~/base/Modal/Modal';
import { Select } from '~/base/Forms/Select';
import { TextInput } from '~/base/Forms/TextInput';
import { component } from '~/utils/component';

export const EditHeadersStep = component<{ onSubmit: (inputs: Record<string, FormDataEntryValue>) => void }>(
    'EditHeadersStep',
    function ({ className, onSubmit }) {
        const formRef = useRef<HTMLFormElement>(null);

        const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const formData = Object.fromEntries(new FormData(e.currentTarget));
            onSubmit(formData);
        };

        const handleReset = () => {
            const { current: form } = formRef;

            if (!form) return;

            const allInputs = [...form.querySelectorAll('input, select')];
            allInputs.forEach((input) => {
                if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
                    input.value = '';
                }
            });
        };

        return (
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className={this.mcn(className)}
            >
                <Modal.Body className={this.__('Content')}>
                    <section className={this.__('Section')}>
                        <Label value='Date'>
                            <TextInput
                                type='date'
                                name='date'
                            />
                        </Label>
                    </section>
                    <section className={this.__('Section')}>
                        <h4 className={this.__('SectionTitle')}>Recipient</h4>
                        <Label value='Names'>
                            <TextInput
                                type='text'
                                name='recipient.names'
                            />
                        </Label>
                        <Label value='Surname'>
                            <TextInput
                                type='text'
                                name='recipient.surname'
                            />
                        </Label>
                        <Label value='Sex'>
                            <Select name='recipient.sex'>
                                <Select.Option value='male'>Male</Select.Option>
                                <Select.Option value='female'>Felame</Select.Option>
                            </Select>
                        </Label>
                        <Label value='Job position'>
                            <TextInput
                                type='text'
                                name='recipient.jobPosition'
                            />
                        </Label>
                    </section>
                    <section className={this.__('Section')}>
                        <h4 className={this.__('SectionTitle')}>Company</h4>
                        <Label value='Name'>
                            <TextInput
                                type='text'
                                name='company.name'
                            />
                        </Label>
                        <Label value='Address line 1'>
                            <TextInput
                                type='text'
                                name='company.addressLine1'
                            />
                        </Label>
                        <Label value='Address line 2'>
                            <TextInput
                                type='text'
                                name='company.addressLine2'
                            />
                        </Label>
                    </section>
                    <section className={this.__('Section')}>
                        <h4 className={this.__('SectionTitle')}>Contacts</h4>
                        <Label value='Phone'>
                            <TextInput
                                type='tel'
                                name='contacts.phone'
                            />
                        </Label>
                        <Label value='E-mail'>
                            <TextInput
                                type='email'
                                name='contacts.email'
                            />
                        </Label>
                    </section>
                    <div className={this.__('ShowRecipientCheckbox')}>
                        <input
                            id='showRecipient'
                            type='checkbox'
                            name='showRecipient'
                        />
                        <label htmlFor='showRecipient'>Show recipient</label>
                    </div>
                </Modal.Body>
                <Modal.Footer className={this.__('Footer')}>
                    <Button
                        type='button'
                        variant='danger'
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                    <Button type='submit'>Next</Button>
                </Modal.Footer>
            </form>
        );
    }
);
