import { Context, useContext } from 'use-context-selector';
import { EditorModalContextType, RichTextContextType } from '../type';

import { ModalHandle } from '~/types/global';
import { RichTextContext } from '../context';
import { useCallback } from 'react';
import { useModalBreakpoint } from '~/hooks/useBreakpoints';

export function useRichTextModal(handle: ModalHandle): EditorModalContextType {
    const { editor, preservedStateController, getHTML } = useContext(RichTextContext as Context<RichTextContextType>);
    const breakpoint = useModalBreakpoint();

    const { saveAll, flushStorage } = preservedStateController;

    const saveAndClose = useCallback(() => {
        saveAll();
        handle.close();
    }, [handle, saveAll]);

    const flushAndClose = useCallback(() => {
        flushStorage();
        handle.close();
    }, [flushStorage, handle]);

    return {
        editor,
        preservedStateController,
        breakpoint,
        flushAndClose,
        saveAndClose,
        getHTML
    };
}
