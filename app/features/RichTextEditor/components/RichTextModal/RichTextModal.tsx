import type { FormEvent, PropsWithChildren } from 'react';
import { act, useCallback } from 'react';

import { ActionType } from '~/config';
import { EditorContent } from '@tiptap/react';
import { EditorModalContext } from '../../context';
import { EditorModalContextType } from '../../type';
import { Form } from '~/base/Forms/Form';
import Modal from '~/base/Modal';
import type { ModalHandle } from '~/types/global';
import { RichTextProvider } from '../RichTextProvider/RichTextProvider';
import { Toolbar } from '../Toolbar/Toolbar';
import { component } from '~/utils/component';
import { useContext } from 'use-context-selector';
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
        action?: string | null;
    }>
>(
    'RichTextModal',
    function ({ className, handle, intent, action = '/action', children }) {
        const modalCtx = useRichTextModal(handle);

        const { editor, flushAndClose, saveAndClose, getHTML } = modalCtx;

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
                    action: action || undefined,
                });
            },
            [getHTML, editor, submit, action]
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
                <EditorModalContext.Provider value={modalCtx}>{children}</EditorModalContext.Provider>
            </Modal>
        );
    },
    // RichTextModal has the same props and is already memoized
    () => false
);

const RichTextModal = component<
    PropsWithChildren<{
        handle: ModalHandle;
        intent: ActionType;
        storageKeyPrefix?: string;
        content?: string;
        addInlineStyles?: boolean;
        action?: string | null;
    }>
>(
    'EditorModalContainer',
    function ({ className, handle, storageKeyPrefix = 'rich-text', content, addInlineStyles, ...props }) {
        if (!handle.isOpen) return null;

        return (
            <RichTextProvider
                storageKeyPrefix={storageKeyPrefix}
                initialContent={content}
                addInlineStyles={addInlineStyles}
            >
                <EditorModalContent
                    handle={handle}
                    {...props}
                />
            </RichTextProvider>
        );
    }
);

export default Object.assign(RichTextModal, {
    Header: EditorModalHeader,
    Body: EditorModalBody,
    Footer: Modal.Footer,
});
