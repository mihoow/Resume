import { type ComponentRefType, component } from '~/utils/component';
import type { CoverLetterDocument, CoverLetterTemplate } from '../../type';
import { FormEvent, InputHTMLAttributes, PropsWithChildren, useMemo, useRef } from 'react';

import { Button } from '~/base/Button/Button';
import { Label } from '~/base/Forms/Label';
import Modal from '~/base/Modal/Modal';
import { Select } from '~/base/Forms/Select';
import { TextInput } from '~/base/Forms/TextInput';
import { capitalize } from '~/utils/text';
import { isLetterDocument } from '../../utils';
import { PreservedStateController } from '~/features/RichTextEditor/type';
import { usePreservedState, usePreservedStateController } from '~/hooks/usePreservedState';

type Sections = Array<{
    title?: string;
    inputs: Array<{
        label: string;
        name: string;
        initialValue: string | boolean | null;
        type?: InputHTMLAttributes<HTMLInputElement>['type'];
        options?: Record<string, string>;
        className?: string;
    }>;
}>;

const PreInput = component<
    PropsWithChildren<{
        stateController: PreservedStateController;
        name: string;
        label?: string;
        initialValue: string | null;
        type?: InputHTMLAttributes<HTMLInputElement>['type'] | 'select';
    }>,
    HTMLInputElement | HTMLSelectElement
>(
    'Input',
    function ({
        className,
        stateController,
        name,
        label = capitalize(name),
        initialValue,
        type = 'text',
        children,
        myRef,
    }) {
        const [defaultValue, onChange] = usePreservedState(stateController, {
            key: name,
            defaultValue: initialValue || '',
        });

        return (
            <Label
                className={this.mcn(className)}
                value={label}
            >
                {type === 'select' ? (
                    <Select
                        myRef={myRef as ComponentRefType<HTMLSelectElement>}
                        name={name}
                        defaultValue={defaultValue}
                        onChange={({ currentTarget: { value } }) => onChange(value)}
                    >
                        {children}
                    </Select>
                ) : (
                    <TextInput
                        inputRef={myRef as ComponentRefType<HTMLInputElement>}
                        type={type}
                        name={name}
                        defaultValue={defaultValue}
                        onChange={({ currentTarget: { value } }) => onChange(value)}
                    />
                )}
            </Label>
        );
    }
);
const Input = Object.assign(PreInput, {
    Option: Select.Option,
});

export const EditHeadersStep = component<{
    companyCode: string;
    data: CoverLetterTemplate | CoverLetterDocument;
    onSubmit: (inputs: Record<string, string>) => void;
}>('EditHeadersStep', function ({ className, companyCode, data, onSubmit }) {
    const allInputsRef = useRef<Record<string, HTMLInputElement | HTMLSelectElement | null>>({});
    const preservedStateController = usePreservedStateController(`clheaders-${companyCode}`);

    const sections: Sections = useMemo(() => {
        const document = isLetterDocument(data)
            ? data
            : {
                  date: '',
                  recipient: {
                      names: '',
                      surname: '',
                      sex: 'male',
                      jobPosition: '',
                  },
                  company: {
                      name: '',
                      addressLine1: '',
                      addressLine2: '',
                  },
                  contacts: {
                      email: '',
                      phone: '',
                  },
                  showRecipient: true,
              };

        const {
            date,
            recipient: { names, surname, sex, jobPosition },
            company: { name: companyName, addressLine1, addressLine2 },
            contacts: { email, phone },
            showRecipient,
        } = document;

        return [
            {
                inputs: [
                    {
                        label: 'Date',
                        name: 'date',
                        type: 'date',
                        initialValue: date,
                    },
                ],
            },
            {
                title: 'Recipient',
                inputs: [
                    {
                        label: 'Names',
                        name: 'recipient.names',
                        initialValue: names,
                    },
                    {
                        name: 'recipient.surname',
                        label: 'Surname',
                        initialValue: surname,
                    },
                    {
                        name: 'recipient.sex',
                        type: 'select',
                        label: 'Sex',
                        initialValue: sex,
                        options: {
                            male: 'Male',
                            female: 'Female',
                        },
                    },
                    {
                        name: 'recipient.jobPosition',
                        label: 'Job position',
                        initialValue: jobPosition,
                    },
                ],
            },
            {
                title: 'Company',
                inputs: [
                    {
                        name: 'company.name',
                        label: 'Name',
                        initialValue: companyName,
                    },
                    {
                        name: 'company.addressLine1',
                        label: 'Address line 1',
                        initialValue: addressLine1,
                    },
                    {
                        name: 'company.addressLine2',
                        label: 'Address line 2',
                        initialValue: addressLine2,
                    },
                ],
            },
            {
                title: 'Contacts',
                inputs: [
                    {
                        type: 'tel',
                        name: 'contacts.phone',
                        label: 'Phone',
                        initialValue: phone,
                    },
                    {
                        type: 'email',
                        name: 'contacts.email',
                        label: 'Email',
                        initialValue: email,
                    },
                ],
            },
            {
                inputs: [
                    {
                        type: 'checkbox',
                        name: 'showRecipient',
                        label: 'Show recipient',
                        initialValue: showRecipient,
                        className: this.__('ShowRecipientCheckbox'),
                    },
                ],
            },
        ] satisfies Sections;
    }, [data]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
        formData.showRecipient = formData.showRecipient || 'off';

        onSubmit(formData);
    };

    const handleReset = () => {
        const { current: allInputs } = allInputsRef;

        preservedStateController.flushStorage();

        sections.forEach(({ inputs }) =>
            inputs.forEach(({ name, initialValue }) => {
                const input = allInputs[name];

                if (!input) return;

                if (input instanceof HTMLInputElement && input.type === 'checkbox') {
                    input.checked = typeof initialValue === 'boolean' ? initialValue : false;
                } else {
                    input.value = initialValue ? String(initialValue) : '';
                }
            })
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={this.mcn(className)}
        >
            <Modal.Body className={this.__('Content')}>
                {sections.map(({ title, inputs }, i) => (
                    <section
                        key={i}
                        className={this.__('Section')}
                    >
                        {title && <h4 className={this.__('SectionTitle')}>{title}</h4>}
                        {inputs.map((attributes) => {
                            const { label, name, type = 'text', initialValue, className = '' } = attributes;

                            const sharedProps = {
                                key: name,
                                stateController: preservedStateController,
                                label,
                                name,
                                initialValue: initialValue ? String(initialValue) : null,
                                className,
                                myRef: (node: HTMLInputElement | HTMLSelectElement | null) => {
                                    allInputsRef.current[name] = node;
                                },
                            };

                            if ('options' in attributes && attributes.options) {
                                const { options } = attributes;

                                return (
                                    <Input {...sharedProps}>
                                        {Object.entries(options).map(([optionValue, optionLabel]) => (
                                            <Input.Option
                                                key={optionValue}
                                                value={optionValue}
                                            >
                                                {optionLabel}
                                            </Input.Option>
                                        ))}
                                    </Input>
                                );
                            }

                            if (type === 'checkbox') {
                                return (
                                    <div className={className}>
                                        <input
                                            id={name}
                                            type='checkbox'
                                            name={name}
                                            defaultChecked={Boolean(initialValue)}
                                            ref={sharedProps.myRef}
                                        />
                                        <label htmlFor={name}>{label}</label>
                                    </div>
                                );
                            }

                            return (
                                <Input
                                    {...sharedProps}
                                    type={type}
                                />
                            );
                        })}
                    </section>
                ))}
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
});
