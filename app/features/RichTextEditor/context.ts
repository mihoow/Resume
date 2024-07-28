import { Context, createContext, useContextSelector } from 'use-context-selector';
import { EditorModalContextType, RichTextContextType } from './type';

export const RichTextContext = createContext<RichTextContextType | null>(null);

export const EditorModalContext = createContext<EditorModalContextType | null>(null);

export function useRichTextForm<Selected>(selector: (ctx: RichTextContextType) => Selected): Selected {
    const selected = useContextSelector(RichTextContext as Context<RichTextContextType>, selector);

    return selected;
}

export function useEditorModal<Selected>(selector: (ctx: EditorModalContextType) => Selected): Selected {
    const selected = useContextSelector(EditorModalContext as Context<EditorModalContextType>, selector);

    return selected;
}
