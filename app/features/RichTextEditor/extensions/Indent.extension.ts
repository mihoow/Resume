import { AllSelection, TextSelection } from '@tiptap/pm/state';

import type { CommandProps } from '@tiptap/react';
import { Extension } from '@tiptap/react';
import type { Node } from '@tiptap/pm/model';
import type { Transaction } from '@tiptap/pm/state';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        indent: {
            indent: () => ReturnType;
            outdent: () => ReturnType;
        };
    }
}

export const Indent = Extension.create({
    name: 'indent',
    defaultOptions: {
        types: ['paragraph', 'blockquote', 'heading'],
        minLevel: 0,
        maxLevel: 4,
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    indent: {
                        renderHTML: ({ indent }) => {
                            return indent > this.options.minLevel
                                ? {
                                      'data-indent': indent,
                                  }
                                : null;
                        },
                        parseHTML: (element) => {
                            const indentLevel = Number(element.getAttribute('data-indent'));
                            return indentLevel && indentLevel > this.options.minLevel ? indentLevel : null;
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        const getNextIndent = (node: Node, delta: number): number | null => {
            if (!node) return null;

            const nextLevel = (node.attrs.indent || 0) + delta;
            const { minLevel, maxLevel } = this.options;
            const indent = nextLevel < minLevel ? minLevel : nextLevel > maxLevel ? maxLevel : nextLevel;

            return indent === node.attrs.indent ? null : indent;
        };

        const setNodeIndentMarkup = (tr: Transaction, node: Node, nextIndent: number, position: number) => {
            const { indent: oldIndent, ...currentAttrs } = node.attrs;
            const nodeAttrs =
                nextIndent > this.options.minLevel
                    ? {
                          ...currentAttrs,
                          indent: nextIndent,
                      }
                    : currentAttrs;

            tr = tr.setNodeMarkup(position, node.type, nodeAttrs, node.marks);

            return tr;
        };

        const updateIndentLevel = (tr: Transaction, delta: number) => {
            const { doc, selection } = tr;

            if (doc && selection && (selection instanceof TextSelection || selection instanceof AllSelection)) {
                const { from, to } = selection;
                doc.nodesBetween(from, to, (node, pos) => {
                    if (this.options.types.includes(node.type.name)) {
                        const node = tr?.doc?.nodeAt(pos);

                        if (!node) return false;

                        const nextIndent = getNextIndent(node, delta);

                        if (nextIndent === null) return false;

                        tr = setNodeIndentMarkup(tr, node, nextIndent, pos);

                        return false;
                    }

                    return true;
                });
            }

            return tr;
        };

        const applyIndent =
            (direction: number) =>
            () =>
            ({ tr, state, dispatch }: CommandProps) => {
                const { selection } = state;
                tr = tr.setSelection(selection);
                tr = updateIndentLevel(tr, direction);

                if (tr.docChanged) {
                    dispatch?.(tr);
                    return true;
                }

                return false;
            };

        return {
            indent: applyIndent(1),
            outdent: applyIndent(-1),
        };
    },
    addKeyboardShortcuts() {
        const isWithinList = () => this.editor.isActive('bulletList') || this.editor.isActive('orderedList');

        return {
            'Tab': () => {
                if (isWithinList()) return false;

                return this.editor.commands.indent();
            },
            'Shift-Tab': () => {
                if (isWithinList()) return false;

                return this.editor.commands.outdent();
            },
        };
    },
});
