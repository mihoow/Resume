import { type Extensions } from '@tiptap/react';
import { ORDERED_TEXT_SIZES } from './base';
import type { StyleRule, TextSize } from '../type';
import TiptapDocument from '@tiptap/extension-document';
import TiptapText from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import TextStyle from '@tiptap/extension-text-style';
import GapCursor from '@tiptap/extension-gapcursor';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Underline from '@tiptap/extension-underline';
import Blockquote from '@tiptap/extension-blockquote';
import TextAlign from '@tiptap/extension-text-align';
import { Indent } from '../extensions/Indent.extension';
import { TextSizes } from '../extensions/TextSizes.extension';
import Placeholder from '@tiptap/extension-placeholder';
import History from '@tiptap/extension-history';

export const EXTENSIONS: Extensions = [
    TiptapDocument,
    TiptapText,
    Paragraph,
    TextStyle,
    GapCursor,
    ListItem,
    BulletList.configure({
        HTMLAttributes: {
            class: 'list',
        },
    }),
    OrderedList.configure({
        HTMLAttributes: {
            class: 'list',
        },
    }),
    Bold,
    Italic,
    Strike.extend({
        addKeyboardShortcuts() {
            return {
                'Alt-Shift-5': () => this.editor.commands.toggleStrike(),
            };
        },
    }),
    Underline,
    Blockquote.extend({
        addKeyboardShortcuts() {
            return {
                'Mod-Shift-9': () => this.editor.commands.toggleBlockquote(),
            };
        },
    }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
    }),
    Indent,
    TextSizes,
    Placeholder,
    History,
];

const TEXT_SIZE_TO_FONT_SIZE: Record<TextSize, string> = {
    sm: '10px',
    md: '13px',
    lg: '18px',
    xl: '32px',
};

export const INLINE_STYLE_RULES: StyleRule[] = [
    {
        selector: 'div',
        styles: {
            fontSize: '13px',
            lineHeight: 1.5,
            color: '#111827',
        },
    },
    {
        selector: 'p',
        styles: { margin: 0 },
    },
    {
        selector: '.list',
        styles: (el) => {
            const isOrderedList = el.tagName === 'OL';

            return {
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                listStylePosition: 'inside',
                listStyleType: isOrderedList ? 'decimal' : 'disc',
            };
        },
    },
    {
        selector: '.list .list',
        styles: (el) => {
            const isOrderedList = el.tagName === 'OL';

            return {
                marginBlockStart: '8px',
                paddingInlineStart: '20px',
                listStyleType: isOrderedList ? 'lower-alpha' : 'circle',
            };
        },
    },
    {
        selector: '.list .list .list',
        styles: (el) => {
            const isOrderedList = el.tagName === 'OL';

            return {
                listStyleType: isOrderedList ? 'lower-roman' : 'square',
            };
        },
    },
    {
        selector: 'li p',
        styles: {
            display: 'inline',
        },
    },
    {
        selector: 'blockquote',
        styles: {
            margin: 0,
            padding: '1rem 10px',
            backgroundColor: '#f9f9f9',
            borderLeft: '5px solid #0D0D0D1A',
        },
    },
    {
        selector: 'strong',
        styles: { fontWeight: 'bold' },
    },
    {
        selector: 'em',
        styles: { fontStyle: 'italic' },
    },
    {
        selector: 's',
        styles: { textDecoration: 'line-through' },
    },
    {
        selector: 'u',
        styles: { textDecoration: 'underline' },
    },
    {
        selector: '[data-indent]',
        styles: (el) => {
            const indent = Number(el.getAttribute('data-indent'));

            if (Number.isNaN(indent)) return {};

            return { marginInlineStart: `${indent * 40}px` };
        },
    },
    {
        selector: '[data-size]',
        styles: (el) => {
            const size = el.getAttribute('data-size');

            const isTextSize = ((size: string | null): size is TextSize => {
                return ORDERED_TEXT_SIZES.includes(size as TextSize);
            })(size);

            if (!isTextSize) return {};

            return {
                lineHeight: 1.5,
                fontSize: TEXT_SIZE_TO_FONT_SIZE[size],
            };
        },
    },
];
