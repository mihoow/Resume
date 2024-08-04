import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react';
import type { EditTextFormData, TemplatesByLanguage } from '../../type';
import type { Locale, ModalHandle } from '~/types/global';
import { TEMPLATE_LANGUAGE_QUERY_PARAM, TEMPLATE_QUERY_PARAM } from '../../config';

import { Button } from '~/base/Button/Button';
import { EditorModalContext } from '~/features/RichTextEditor/context';
import { Label } from '~/base/Forms/Label';
import Modal from '~/base/Modal/Modal';
import RichTextModal from '~/features/RichTextEditor/components/RichTextModal/RichTextModal';
import { RichTextProvider } from '~/features/RichTextEditor/components/RichTextProvider/RichTextProvider';
import { Select } from '~/base/Forms/Select';
import { TextInput } from '~/base/Forms/TextInput';
import { capitalize } from '~/utils/text';
import { component } from '~/utils/component';
import { usePreservedState } from '~/hooks/usePreservedState';
import { useRichTextModal } from '~/features/RichTextEditor/hooks/useRichTextModal';
import { useSearchParams } from '@remix-run/react';

type Props = {
    handle: ModalHandle;
    language: Locale;
    templates: TemplatesByLanguage;
    onPrev: VoidFunction | null;
    onSubmit: (data: EditTextFormData) => void;
};

const Content = component<
    Props & { currentTemplateName: string; onTemplateChange: (name: string, lang: Locale) => void }
>(
    'EditCoverLetterText',
    function ({ className, handle, language, templates, onPrev, onSubmit, currentTemplateName, onTemplateChange }) {
        const richTextModalCtx = useRichTextModal(handle);

        const languageSelectRef = useRef<HTMLSelectElement>(null);
        const submitInputRef = useRef<HTMLInputElement>(null);

        const { getHTML, preservedStateController } = richTextModalCtx;

        const [initialLanguage, saveLanguage] = usePreservedState(preservedStateController, {
            key: 'language',
            defaultValue: language,
        });
        const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage as Locale);

        const handleTemplateChange = ({ currentTarget: { value: nextName } }: ChangeEvent<HTMLSelectElement>) => {
            onTemplateChange(nextName, selectedLanguage);
        };

        const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const html = getHTML();
            const { current: languageSelect } = languageSelectRef;
            const { current: submitInput } = submitInputRef;

            if (!html || !languageSelect || !submitInput) return;

            const language = languageSelect.value as Locale;

            if (submitInput.value === 'document') {
                onSubmit({
                    language,
                    html,
                    nameAsTemplate: null,
                    saveAs: 'document',
                });

                return;
            } else {
                const match = submitInput.value.match(/^temp:\((\w+)\)(?::document)?$/);

                if (!match) {
                    alert('Submit input is not correct!');

                    return;
                }

                const nameAsTemplate = match[1];

                onSubmit({
                    language,
                    html,
                    nameAsTemplate,
                    saveAs: submitInput.value.endsWith(':document') ? 'template-and-document' : 'template',
                });
            }
        };

        return (
            <EditorModalContext.Provider value={richTextModalCtx}>
                <form
                    onSubmit={handleSubmit}
                    className={this.mcn(className)}
                >
                    <RichTextModal.Body
                        className={this.__('Editor')}
                        editorClassName={this.__('RichText')}
                    >
                        <fieldset className={this.__('Configuration')}>
                            <Label value='Language'>
                                <Select
                                    myRef={languageSelectRef}
                                    name='language'
                                    defaultValue={initialLanguage}
                                    onChange={({ currentTarget: { value } }) => {
                                        saveLanguage(value);
                                        setSelectedLanguage(value as Locale);
                                    }}
                                >
                                    <Select.Option value='en'>English</Select.Option>
                                    <Select.Option value='pl'>Polish</Select.Option>
                                </Select>
                            </Label>
                            <Label value='Template'>
                                <Select
                                    value={currentTemplateName}
                                    onChange={handleTemplateChange}
                                >
                                    <Select.Option value='none'>None</Select.Option>
                                    <Select.Option value='empty'>Empty</Select.Option>
                                    {templates[selectedLanguage].map(({ name, language }) => (
                                        <Select.Option
                                            key={`${name}-${language}`}
                                            value={name}
                                        >
                                            {capitalize(name)}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Label>
                        </fieldset>
                    </RichTextModal.Body>
                    <Modal.Footer className={this.__('Footer')}>
                        {onPrev && (
                            <Button
                                type='button'
                                onClick={onPrev}
                            >
                                Prev
                            </Button>
                        )}
                        <div className={this.__('Explanation')}>
                            <h5>Write:</h5>
                            <ul>
                                <li>`temp:(name)` - to save it only as template</li>
                                <li>`document` - to save it as personalized cover letter</li>
                                <li>`temp:(name):document` - to save it as both</li>
                            </ul>
                        </div>
                        <div className={this.__('SubmitArea')}>
                            <TextInput
                                inputRef={submitInputRef}
                                type='text'
                                className={this.__('SubmitInput')}
                            />
                            <Button
                                type='submit'
                                variant='submit'
                                className={this.__('Submit')}
                            >
                                Save
                            </Button>
                        </div>
                    </Modal.Footer>
                </form>
            </EditorModalContext.Provider>
        );
    }
);

export const EditCoverLetterText = component<Props & { initialHTML: string; companyCode: string | null }>(
    'EditCoverLetterTextProvider',
    function ({ className, initialHTML, companyCode, ...props }) {
        const [searchParams, setSearchParams] = useSearchParams();
        const currentTemplateName = searchParams.get(TEMPLATE_QUERY_PARAM) || 'none';

        const handleTemplateChange = useCallback((nextTemplate: string, language: Locale) => {
            setSearchParams((params) => {
                params.set(TEMPLATE_QUERY_PARAM, nextTemplate);
                params.set(TEMPLATE_LANGUAGE_QUERY_PARAM, language);

                return params;
            });
        }, []);

        const storagePrefix = companyCode
            ? `cltext-${companyCode}-${currentTemplateName}`
            : `cltext-${currentTemplateName}`;

        return (
            <RichTextProvider
                storageKeyPrefix={storagePrefix}
                initialContent={initialHTML}
            >
                <Content
                    className={className}
                    currentTemplateName={currentTemplateName}
                    onTemplateChange={handleTemplateChange}
                    {...props}
                />
            </RichTextProvider>
        );
    }
);
