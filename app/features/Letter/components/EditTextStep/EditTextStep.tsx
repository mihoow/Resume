import { FormEvent, useRef, useState } from 'react';
import type { Locale, ModalHandle } from '~/types/global';

import { Button } from '~/base/Button/Button';
import { EditTextFormData } from '../../type';
import EditorModal from '~/features/RichTextEditor/components/EditorModal/EditorModal';
import { EditorModalContext } from '~/features/RichTextEditor/context';
import { Label } from '~/base/Forms/Label';
import Modal from '~/base/Modal/Modal';
import { RichTextProvider } from '~/features/RichTextEditor/components/RichTextProvider/RichTextProvider';
import { Select } from '~/base/Forms/Select';
import { TextInput } from '~/base/Forms/TextInput';
import { component } from '~/utils/component';
import { useRichTextModal } from '~/features/RichTextEditor/hooks/useRichTextModal';

type Props = {
    handle: ModalHandle;
    language: Locale;
    onPrev: VoidFunction | null;
    onSubmit: (data: EditTextFormData) => void;
};

const EditTextStepContent = component<Props>('EditTextStep', function ({ className, handle, language, onPrev, onSubmit }) {
    const richTextModalCtx = useRichTextModal(handle);
    const [template, setTemplate] = useState('none');

    const languageSelectRef = useRef<HTMLSelectElement>(null);
    const submitInputRef = useRef<HTMLInputElement>(null);

    const { getHTML } = richTextModalCtx;

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
                <EditorModal.Body className={this.__('Editor')}>
                    <fieldset className={this.__('Configuration')}>
                        <Label value='Language'>
                            <Select
                                myRef={languageSelectRef}
                                name='language'
                                defaultValue={language}
                            >
                                <Select.Option value='en'>English</Select.Option>
                                <Select.Option value='pl'>Polish</Select.Option>
                            </Select>
                        </Label>
                        <Label value='Template'>
                            <Select
                                value={template}
                                onChange={({ currentTarget: { value } }) => setTemplate(value)}
                            >
                                <Select.Option value='none'>None</Select.Option>
                            </Select>
                        </Label>
                    </fieldset>
                </EditorModal.Body>
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
});

export const EditTextStep = component<Props & { initialHTML: string }>(
    'EditTextStepProvider',
    function ({ className, initialHTML, ...props }) {
        return (
            <RichTextProvider initialContent={initialHTML}>
                <EditTextStepContent
                    className={className}
                    {...props}
                />
            </RichTextProvider>
        );
    }
);
