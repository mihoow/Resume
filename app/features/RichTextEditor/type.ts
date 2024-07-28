import type { CSSProperties, FC } from 'react';
import type { ChainedCommands, Editor } from '@tiptap/react';

import type { DebouncedState } from 'use-debounce';
import type { ModalBreakpoint } from '~/types/media';

export type TextSize = 'sm' | 'md' | 'lg' | 'xl';

export type ToolbarButton = {
    content: FC;
    tooltip?: string | [string, string];
    shortcut?: string;
    activeName?: string | Record<string, string>;
    breakpoints?: ModalBreakpoint[];
};

export type ActionButton = ToolbarButton & {
    action: (e: ChainedCommands) => ChainedCommands;
    canBeDisabled?: boolean;
};

export type ButtonGroup = ToolbarButton & {
    type: 'checklist';
    items: ActionButton[];
};

export type ToolbarItem = ActionButton | ButtonGroup | null;

export type StyleRule = {
    selector: string;
    styles: CSSProperties | ((element: HTMLElement) => CSSProperties);
};

export type PreservedStateController = {
    saveAll: VoidFunction;
    flushStorage: VoidFunction;
    addStateSaver: (storageKey: string, saverCallback: DebouncedState<(value: string) => void>) => void;
};

export type RichTextContextType = {
    editor: Editor;
    preservedStateController: PreservedStateController;
    getHTML: () => string | null;
}

export type EditorModalContextType = RichTextContextType & {
    breakpoint: ModalBreakpoint;
    saveAndClose: VoidFunction;
    flushAndClose: VoidFunction;
};
