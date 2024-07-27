import { Context, createContext, useContextSelector } from 'use-context-selector';

import { EditorModalContextType } from './type';

export const EditorModalContext = createContext<EditorModalContextType | null>(null);

export function useEditorModal<Selected>(selector: (ctx: EditorModalContextType) => Selected): Selected {
    const selected = useContextSelector(EditorModalContext as Context<EditorModalContextType>, selector);

    return selected;
}
