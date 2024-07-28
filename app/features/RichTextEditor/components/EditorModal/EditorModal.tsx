import { Context, useContext } from 'use-context-selector';
import { EditorModalContext, RichTextContext } from '../../context';
import { EditorModalContextType, RichTextContextType } from '../../type';
import type { FormEvent, PropsWithChildren } from 'react';

import { ActionType } from '~/config';
import { EditorContent } from '@tiptap/react';
import { Form } from '~/base/Forms/Form';
import Modal from '~/base/Modal';
import type { ModalHandle } from '~/types/global';
import { RichTextProvider } from '../RichTextProvider/RichTextProvider';
import { Toolbar } from '../Toolbar/Toolbar';
import { component } from '~/utils/component';
import { useCallback } from 'react';
import { useRichTextModal } from '../../hooks/useRichTextModal';
import { useSubmit } from '@remix-run/react';

const EditorModalHeader = component<PropsWithChildren<{ title: string }>>(
    'EditorModalHeader',
    function ({ className, title, children }) {
        return (
            <Modal.Header className={this.mcn(className)}>
                <span className={this.__('ModalTitle')}>{title}</span>
                {children}
            </Modal.Header>
        );
    }
);

const EditorModalBody = component<PropsWithChildren<{ editorClassName?: string }>>(
    'EditorModalBody',
    function ({ className, editorClassName, children }) {
        // here it needs to be accessed this way, otherwise toolbar won't detect changes in editor content
        const { editor, breakpoint } = useContext(EditorModalContext) as EditorModalContextType;

        return (
            <Modal.Body className={this.mcn(className)}>
                <div className={this.__('Content')}>
                    {children}
                    <EditorContent
                        editor={editor}
                        className={this.cn(this.__('Editor'), editorClassName)}
                    />
                </div>
                <Toolbar
                    editor={editor}
                    className={this.__('Toolbar')}
                    breakpoint={breakpoint}
                />
            </Modal.Body>
        );
    }
);

const EditorModalContent = component<
    PropsWithChildren<{
        handle: ModalHandle;
        intent: ActionType;
    }>
>(
    'EditorModal',
    function ({ className, handle, intent, children }) {
        const modalCtx = useRichTextModal(handle);

        const {
            editor,
            flushAndClose,
            saveAndClose,
            getHTML
        } = modalCtx;

        const submit = useSubmit();

        const handleSubmit = useCallback(
            (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();

                const html = getHTML();

                if (!html) return;

                const formData = new FormData(e.currentTarget);
                formData.set('content', html);

                submit(formData, {
                    method: 'POST',
                    action: '/action',
                });
            },
            [getHTML, editor, submit]
        );

        if (!editor) return null;

        return (
            <Modal
                show={handle.isOpen}
                onClose={saveAndClose}
                as={Form}
                intent={intent}
                onSubmit={handleSubmit}
                onSuccess={flushAndClose}
                className={this.mcn(className)}
            >
                <EditorModalContext.Provider
                    value={modalCtx}
                >
                    {children}
                </EditorModalContext.Provider>
            </Modal>
        );
    },
    // EditorModal has the same props and is already memoized
    () => false
);

const EditorModal = component<
    PropsWithChildren<{
        handle: ModalHandle;
        intent: ActionType;
        content?: string;
        addInlineStyles?: boolean;
    }>
>('EditorModalContainer', function ({ className, handle, content, addInlineStyles, ...props }) {
    if (!handle.isOpen) return null;

    return (
        <RichTextProvider
            initialContent={content}
            addInlineStyles={addInlineStyles}
        >
            <EditorModalContent
                handle={handle}
                {...props}
            />
        </RichTextProvider>
    );
});

export default Object.assign(EditorModal, {
    Header: EditorModalHeader,
    Body: EditorModalBody,
    Footer: Modal.Footer,
});
