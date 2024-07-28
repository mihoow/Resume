import { FormEvent, useState } from 'react';

import { Button } from '~/base/Button/Button';
import EditorModal from '~/features/RichTextEditor/components/EditorModal/EditorModal';
import { EditorModalContext } from '~/features/RichTextEditor/context';
import { Label } from '~/base/Forms/Label';
import Modal from '~/base/Modal/Modal';
import type { ModalHandle } from '~/types/global';
import { RichTextProvider } from '~/features/RichTextEditor/components/RichTextProvider/RichTextProvider';
import { Select } from '~/base/Forms/Select';
import { TextInput } from '~/base/Forms/TextInput';
import { component } from '~/utils/component';
import { useRichTextModal } from '~/features/RichTextEditor/hooks/useRichTextModal';

type Props = {
    handle: ModalHandle;
    onPrev: VoidFunction;
    onSubmit: () => void;
};

const EditTextStepContent = component<Props>('EditTextStep', function ({ className, handle, onPrev, onSubmit }) {
    const richTextModalCtx = useRichTextModal(handle);
    const [template, setTemplate] = useState('none');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        onSubmit();
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
                            <Select name='language'>
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
                    <Button
                        type='button'
                        onClick={onPrev}
                    >
                        Prev
                    </Button>
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

export const EditTextStep = component<Props>('EditTextStepProvider', function ({ className, ...props }) {
    return (
        <RichTextProvider initialContent=''>
            <EditTextStepContent
                className={className}
                {...props}
            />
        </RichTextProvider>
    );
});
