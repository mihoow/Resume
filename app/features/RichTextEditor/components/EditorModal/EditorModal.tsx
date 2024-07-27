import { EditorContent, useEditor } from '@tiptap/react';
import type { FormEvent, PropsWithChildren } from 'react';
import { useCallback, useEffect } from 'react';
import {
    usePreservedState,
    usePreservedStateController,
} from '../../hooks/usePreservedState';

import { ActionType } from '~/config';
import { EXTENSIONS } from '../../config/editor';
import { EditorModalContext } from '../../context';
import { EditorModalContextType } from '../../type';
import { Form } from '~/base/Forms/Form';
import Modal from '~/base/Modal';
import type { ModalHandle } from '~/types/global';
import { Toolbar } from '../Toolbar/Toolbar';
import { addInlineStylesToHTML } from '../../utils';
import { component } from '~/utils/component';
import { useContext } from 'use-context-selector';
import { useMirrorRef } from '~/hooks/useMirrorRef';
import { useModalBreakpoint } from '~/hooks/useBreakpoints';
import { useSubmit } from '@remix-run/react';

type Props = {
    handle: ModalHandle;
    intent: ActionType;
    content?: string;
    addInlineStyles?: boolean;
};

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

const EditorModalContent = component<PropsWithChildren<Props>>(
    'EditorModal',
    function ({ className, handle, intent, content: initialContent = '', addInlineStyles = false, children }) {
        const breakpoint = useModalBreakpoint();
        const preservedStateController = usePreservedStateController();
        const [content, onContentChange] = usePreservedState(preservedStateController, {
            key: 'content',
            defaultValue: initialContent,
        });

        const { saveAll, flushStorage } = preservedStateController;

        const editor = useEditor({
            extensions: EXTENSIONS,
            content,
        });
        const submit = useSubmit();

        const argsRef = useMirrorRef({ editor, onContentChange });

        useEffect(() => {
            const { editor, onContentChange } = argsRef.current;

            if (!editor) return;

            onContentChange(editor.getHTML());
        }, [editor?.state.doc.content, argsRef]);

        const handleSubmit = useCallback(
            (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();

                if (!editor) return;

                const content = (() => {
                    if (editor.isEmpty) return '';

                    const html = editor.getHTML();

                    return addInlineStyles ? addInlineStylesToHTML(html) : html;
                })();

                const formData = new FormData(e.currentTarget);
                formData.set('content', content);

                submit(formData, {
                    method: 'POST',
                    action: '/action',
                });
            },
            [addInlineStyles, editor, submit]
        );

        const saveAndClose = useCallback(() => {
            saveAll();
            handle.close();
        }, [handle, saveAll]);

        const flushAndClose = useCallback(() => {
            flushStorage();
            handle.close();
        }, [flushStorage, handle]);

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
                    value={{ editor, breakpoint, preservedStateController, saveAndClose, flushAndClose }}
                >
                    {children}
                </EditorModalContext.Provider>
            </Modal>
        );
    },
    // EditorModal has the same props and is already memoized
    () => false
);

const EditorModal = component<PropsWithChildren<Props>>(
    'EditorModalContainer',
    function ({ className, handle, ...props }) {
        if (!handle.isOpen) return null;

        return (
            <EditorModalContent
                handle={handle}
                {...props}
            />
        );
    }
);

export default Object.assign(EditorModal, {
    Header: EditorModalHeader,
    Body: EditorModalBody,
    Footer: Modal.Footer,
});
