import { useCallback, useEffect } from 'react';
import { usePreservedState, usePreservedStateController } from '../../hooks/usePreservedState';

import { EXTENSIONS } from '../../config/editor';
import type { PropsWithChildren } from 'react';
import { RichTextContext } from '../../context';
import { addInlineStylesToHTML } from '../../utils';
import { component } from '~/utils/component';
import { useEditor } from '@tiptap/react';
import { useMirrorRef } from '~/hooks/useMirrorRef';

export const RichTextProvider = component<PropsWithChildren<{ initialContent?: string; addInlineStyles?: boolean }>>(
    'RichTextProvider',
    function ({ initialContent, addInlineStyles = false, children }) {
        const preservedStateController = usePreservedStateController();
        const [content, onContentChange] = usePreservedState(preservedStateController, {
            key: 'content',
            defaultValue: initialContent,
        });

        const editor = useEditor({
            extensions: EXTENSIONS,
            content,
        });

        const argsRef = useMirrorRef({ editor, onContentChange });

        useEffect(() => {
            const { editor, onContentChange } = argsRef.current;

            if (!editor) return;

            onContentChange(editor.getHTML());
        }, [editor?.state.doc.content, argsRef]);

        const getHTML = useCallback(() => {
            if (!editor) return null;

            const content = (() => {
                if (editor.isEmpty) return '';

                const html = editor.getHTML();

                return addInlineStyles ? addInlineStylesToHTML(html) : html;
            })();

            return content;
        }, [addInlineStyles, editor]);

        if (!editor) return null;

        return (
            <RichTextContext.Provider value={{ editor, preservedStateController, getHTML }}>
                {children}
            </RichTextContext.Provider>
        );
    }
);
