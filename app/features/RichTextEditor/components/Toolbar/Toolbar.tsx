import type { ActionButton, ButtonGroup, ToolbarButton, ToolbarItem } from '../../type';

import { CheckIcon } from '~/icons/Check';
import type { Editor } from '@tiptap/react';
import { IconButton } from '../IconButton/IconButton';
import type { IconButtonProps } from '../IconButton/IconButton';
import { ModalBreakpoint } from '~/types/media';
import { Popover } from '~/base/Popover/Popover';
import { TOOLBAR_ITEMS } from '../../config/toolbar';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

function isButtonGroup(item: ToolbarItem): item is ButtonGroup {
    return !!item && 'type' in item && item.type === 'checklist';
}

export const Toolbar = component<{ editor: Editor | null; breakpoint: ModalBreakpoint }>(
    'Toolbar',
    function ({ className, editor, breakpoint }) {
        const t = useTranslation();

        if (!editor) return null;

        const isButtonVisible = (breakpoints?: ModalBreakpoint[]) => {
            if (!breakpoints) return true;

            return breakpoints.includes(breakpoint);
        };

        const translate = (translation: string | [string, string]) => {
            if (typeof translation === 'string') return translation;

            return t(...translation);
        };

        const getBaseProps = ({ content: icon, tooltip, shortcut, activeName }: ToolbarButton): IconButtonProps => ({
            type: 'button',
            isActive: activeName ? editor.isActive(activeName) : false,
            title: tooltip ? `${translate(tooltip)}${shortcut ? ` (${shortcut})` : ''}` : '',
            icon,
        });

        const getActionButtonProps = ({ action, canBeDisabled, ...baseProps }: ActionButton): IconButtonProps => ({
            ...getBaseProps(baseProps),
            disabled: canBeDisabled ? !action(editor.can().chain().focus()).run() : false,
            onClick: () => action(editor.chain().focus()).run(),
        });

        return (
            <div className={this.mcn(className)}>
                {TOOLBAR_ITEMS.map((button, i) => {
                    if (!button) {
                        return (
                            <span
                                key={i}
                                className={this.__('Break')}
                            />
                        );
                    }

                    const { breakpoints } = button;

                    if (!isButtonVisible(breakpoints)) return null;

                    if (isButtonGroup(button)) {
                        const { type, items } = button;

                        return (
                            <Popover
                                key={i}
                                placement='top'
                                content={
                                    <div className={this.__('Group')}>
                                        {items.map((actionButton, i) => {
                                            const { breakpoints } = actionButton;

                                            if (!isButtonVisible(breakpoints)) return null;

                                            const {
                                                isActive,
                                                icon: Icon,
                                                ...props
                                            } = getActionButtonProps(actionButton);

                                            return (
                                                <button
                                                    key={i}
                                                    className={this.__('GroupButton', { [type]: true, isActive })}
                                                    {...props}
                                                >
                                                    {type === 'checklist' && isActive && <CheckIcon />}
                                                    <Icon />
                                                </button>
                                            );
                                        })}
                                    </div>
                                }
                            >
                                <IconButton
                                    {...getBaseProps(button)}
                                    className={this.__('Button')}
                                />
                            </Popover>
                        );
                    }

                    return (
                        <IconButton
                            key={i}
                            {...getActionButtonProps(button)}
                            className={this.__('Button')}
                        />
                    );
                })}
            </div>
        );
    },
    () => false
);
