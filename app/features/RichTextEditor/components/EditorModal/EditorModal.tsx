import { EditorContent, useEditor } from '@tiptap/react';
import { useCallback, useEffect } from 'react';

import { ActionType } from '~/config';
import { EXTENSIONS } from '../../config/editor';
import { Footer } from '../Footer/Footer';
import { Form } from '~/base/Forms/Form';
import type { FormEvent } from 'react';
import Modal from '~/base/Modal';
import type { ModalHandle } from '~/types/global';
import { SendEmailFields } from '../SendEmailFields/SendEmailFields';
import { SendIcon } from '../../icons/Send';
import { Submit } from '~/base/Forms/Submit';
import { Toolbar } from '../Toolbar/Toolbar';
import { addInlineStylesToHTML } from '../../utils';
import { component } from '~/utils/component';
import { useMirrorRef } from '~/hooks/useMirrorRef';
import { useModalBreakpoint } from '~/hooks/useBreakpoints';
import { usePreservedState } from '../../hooks/usePreservedState';
import { useSubmit } from '@remix-run/react';
import { useTranslation } from '~/hooks/useTranslation';

type Props = {
    handle: ModalHandle;
    intent: ActionType;
    content?: string;
    addInlineStyles?: boolean;
};

const EditorModalContent = component<Props>(
    'EditorModal',
    function ({ className, handle, intent, content: initialContent = '', addInlineStyles = false }) {
        const breakpoint = useModalBreakpoint();
        const {
            initialData: { content, email, topic },
            saveContent,
            saveEmail,
            saveTopic,
            saveAll,
            flushStorage,
        } = usePreservedState(intent, initialContent);

        const t = useTranslation();
        const editor = useEditor({
            extensions: EXTENSIONS,
            content,
        });
        const submit = useSubmit();

        const argsRef = useMirrorRef({ editor, saveContent });

        useEffect(() => {
            const { editor, saveContent } = argsRef.current;

            if (!editor) return;

            saveContent(editor.getHTML());
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
                    action: '/action'
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

        const isEmailSender = intent === ActionType.SEND_EMAIL

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
                <Modal.Header>
                    <span className={this.__('ModalTitle', )}>{t('Contact me', 'Skontaktuj się')}</span>
                    {breakpoint === 'mobile' && (
                        <Submit
                            variant='submit'
                            className={this.__('MobileSubmit')}
                            loadingText=''
                        >
                            <SendIcon />
                        </Submit>
                    )}
                </Modal.Header>
                <Modal.Body className={this.__('Body')}>
                    <div className={this.__('Content')}>
                        {isEmailSender && (
                            <SendEmailFields
                                initialEmail={email}
                                onEmailChange={saveEmail}
                                initialTopic={topic}
                                onTopicChange={saveTopic}
                                className={this.__('Inputs')}
                            />
                        )}
                        <EditorContent
                            editor={editor}
                            className={this.__('Editor', [isEmailSender ? 'withEmailFields' : null])}
                        />
                    </div>
                    <Toolbar
                        editor={editor}
                        className={this.__('Toolbar')}
                        breakpoint={breakpoint}
                    />
                </Modal.Body>
                {breakpoint === 'desktop' && (
                    <Modal.Footer className={this.__('Footer')}>
                        <Footer onDismiss={flushAndClose} />
                    </Modal.Footer>
                )}
            </Modal>
        );
    },
    // EditorModal has the same props and is already memoized
    () => false
);

export const EditorModal = component<Props>('EditorModalContainer', function ({ className, handle, ...props }) {
    if (!handle.isOpen) return null;

    return (
        <EditorModalContent
            handle={handle}
            {...props}
        />
    );
});

export default EditorModal;
