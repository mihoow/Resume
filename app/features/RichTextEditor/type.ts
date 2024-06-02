import type { CSSProperties, FC } from "react";

import type { ChainedCommands } from "@tiptap/react";

export type TextSize = 'sm' | 'md' | 'lg' | 'xl';

export type Breakpoint = 'mobile' | 'desktop';

export type ToolbarButton = {
    content: FC;
    tooltip?: string | [string, string];
    shortcut?: string;
    activeName?: string | Record<string, string>;
    breakpoints?: Breakpoint[];
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
