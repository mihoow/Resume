import type { CommandProps } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import { ORDERED_TEXT_SIZES } from '../config/base';
import type { Selection } from '@tiptap/pm/state';
import type { TextSize } from '../type';

export interface TextSizesOptions {
    types: string[];
    sizes: TextSize[];
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        textSizes: {
            setTextSize: (size: TextSize) => ReturnType;
            resetTextSize: () => ReturnType;
            increaseTextSize: () => ReturnType;
            decreaseTextSize: () => ReturnType;
        };
    }
}

export const TextSizes = Extension.create<TextSizesOptions>({
    name: 'textSizes',

    addOptions() {
        return {
            types: ['textStyle'],
            sizes: [...ORDERED_TEXT_SIZES],
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    size: {
                        default: 'md',
                        parseHTML: (element) => element.getAttribute('data-size'),
                        renderHTML: ({ size }) => {
                            if (!this.options.sizes.includes(size)) return {};

                            return {
                                'data-size': size,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        const getNextSize = (doc: Node, { from, to }: Selection, direction: number): TextSize | null => {
            let nextSize: TextSize | null = 'md';

            doc.nodesBetween(from, to, (node) => {
                const { marks } = node;
                let currSize: TextSize | null = null;

                for (let {
                    type: { name: markName },
                    attrs,
                } of marks) {
                    const isValidMark = this.options.types.includes(markName);

                    if (!isValidMark || !('size' in attrs)) continue;

                    currSize = this.options.sizes.includes(attrs.size) ? attrs.size : 'md';

                    break;
                }

                if (!currSize) return true;

                nextSize = ((): TextSize | null => {
                    const orderedSizes = ORDERED_TEXT_SIZES.filter((size) => this.options.sizes.includes(size));
                    const currSizeIndex = orderedSizes.findIndex((size) => size === currSize);
                    const nextSize = orderedSizes[currSizeIndex + direction];

                    return nextSize || null;
                })();

                return false;
            });

            return nextSize;
        };

        const updateTextSize =
            (direction: number) =>
            () =>
            ({ tr: { doc }, state: { selection }, chain }: CommandProps) => {
                const nextSize = getNextSize(doc, selection, direction);

                if (!nextSize) return false;

                return chain().setMark('textStyle', { size: nextSize }).run();
            };

        return {
            setTextSize:
                (size) =>
                ({ chain }) => {
                    if (!this.options.sizes.includes(size)) {
                        return false;
                    }

                    return chain().setMark('textStyle', { size }).run();
                },
            resetTextSize:
                () =>
                ({ chain }) => {
                    return chain().setMark('textStyle', { size: null }).removeEmptyTextStyle().run();
                },
            increaseTextSize: updateTextSize(1),
            decreaseTextSize: updateTextSize(-1),
        };
    },

    addKeyboardShortcuts() {
        return {
            [`Mod-Alt-=`]: () => this.editor.commands.increaseTextSize(),
            [`Mod-Alt--`]: () => this.editor.commands.decreaseTextSize(),
        };
    },
});
