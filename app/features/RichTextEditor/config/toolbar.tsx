import { BoldIcon } from '../icons/Bold';
import { FontIcon } from '../icons/Font';
import { IndentLeftIcon } from '../icons/IndentLeft';
import { IndentRightIcon } from '../icons/IndentRight';
import { ItalicIcon } from '../icons/Italic';
import { ListOlIcon } from '../icons/ListOl';
import { ListUlIcon } from '../icons/ListUl';
import { QuoteIcon } from '../icons/Quote';
import { RedoIcon } from '../icons/Redo';
import { StrikethroughIcon } from '../icons/Strikethrough';
import { TextCenterIcon } from '../icons/TextCenter';
import { TextLeftIcon } from '../icons/TextLeft';
import { TextRightIcon } from '../icons/TextRight';
import { TextSizeSample } from '../components/TextSize/TextSize';
import type { ToolbarItem } from "../type"
import { UnderlineIcon } from '../icons/Underline';
import { UndoIcon } from '../icons/Undo';

export const TOOLBAR_ITEMS: Readonly<ToolbarItem[]> = [
    {
        content: UndoIcon,
        tooltip: ['Undo', 'Cofnij'],
        shortcut: 'Ctrl Z',
        action: (e) => e.undo(),
        canBeDisabled: true,
        breakpoints: ['desktop']
    },
    {
        content: RedoIcon,
        tooltip: ['Redo', 'Ponów'],
        shortcut: 'Ctrl Y',
        action: (e) => e.redo(),
        canBeDisabled: true,
        breakpoints: ['desktop']
    },
    null,
    {
        content: BoldIcon,
        tooltip: ['Bold', 'Pogrubienie'],
        shortcut: 'Ctrl B',
        action: (e) => e.toggleBold(),
        activeName: 'bold',
    },
    {
        content: ItalicIcon,
        tooltip: ['Italic', 'Kursywa'],
        shortcut: 'Ctrl I',
        action: (e) => e.toggleItalic(),
        activeName: 'italic',
    },
    {
        content: UnderlineIcon,
        tooltip: ['Underline', 'Podkreślenie'],
        shortcut: 'Ctrl U',
        action: (e) => e.toggleUnderline(),
        activeName: 'underline',
    },
    {
        content: StrikethroughIcon,
        tooltip: ['Strikethrough', 'Przekreślenie'],
        shortcut: 'Alt Shift 5',
        action: (e) => e.toggleStrike(),
        activeName: 'strike',
    },
    {
        content: QuoteIcon,
        tooltip: ['Quote', 'Cytuj'],
        shortcut: 'Ctrl Shift 9',
        action: (e) => e.toggleBlockquote(),
        activeName: 'blockquote',
    },
    null,
    {
        type: 'checklist',
        content: FontIcon,
        tooltip: ['Size', 'Rozmiar'],
        shortcut: 'Ctrl Alt -, Ctrl Alt +',
        items: [
            {
                content: () => <TextSizeSample size='sm' />,
                action: (e) => e.setTextSize('sm'),
                activeName: { size: 'sm' },
            },
            {
                content: () => <TextSizeSample size='md' />,
                action: (e) => e.setTextSize('md'),
                activeName: { size: 'md' },
            },
            {
                content: () => <TextSizeSample size='lg' />,
                action: (e) => e.setTextSize('lg'),
                activeName: { size: 'lg' },
            },
            {
                content: () => <TextSizeSample size='xl' />,
                action: (e) => e.setTextSize('xl'),
                activeName: { size: 'xl' },
            },
        ],
    },
    null,
    {
        content: ListOlIcon,
        tooltip: ['Ordered list', 'Lista numerowana'],
        shortcut: 'Ctrl Shift 7',
        action: (e) => e.toggleOrderedList(),
        activeName: 'orderedList',
    },
    {
        content: ListUlIcon,
        tooltip: ['Bullet list', 'Lista punktowana'],
        shortcut: 'Ctrl Shift 8',
        action: (e) => e.toggleBulletList(),
        activeName: 'bulletList',
    },
    null,
    {
        content: TextLeftIcon,
        tooltip: ['Align left', 'Wyrównaj do lewej'],
        shortcut: 'Ctrl Shift L',
        action: (e) => e.setTextAlign('left'),
        activeName: { textAlign: 'left' },
    },
    {
        content: TextCenterIcon,
        tooltip: ['Align to center', 'Wyrównaj do środka'],
        shortcut: 'Ctrl Shift E',
        action: (e) => e.setTextAlign('center'),
        activeName: { textAlign: 'center' },
    },
    {
        content: TextRightIcon,
        tooltip: ['Align right', 'Wyrównaj do prawej'],
        shortcut: 'Ctrl Shift R',
        action: (e) => e.setTextAlign('right'),
        activeName: { textAlign: 'right' },
    },
    {
        content: IndentLeftIcon,
        tooltip: ['Indent', 'Zwiększ wcięcie'],
        shortcut: 'Tab',
        action: (e) => e.indent(),
        canBeDisabled: true,
    },
    {
        content: IndentRightIcon,
        tooltip: ['Outdent', 'Zmniejsz wcięcie'],
        shortcut: 'Shift Tab',
        action: (e) => e.outdent(),
        canBeDisabled: true,
    }
];
