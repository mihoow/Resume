import type { ComponentProps, ComponentPropsWithoutRef, FC, MutableRefObject, ReactNode } from 'react';
import { ComponentRefType, component } from '~/utils/component';

import { FormContext } from './Form.context';
import { useContextSelector } from 'use-context-selector';

type InputColor = 'gray' | 'info' | 'failure' | 'warning' | 'success';

type Props = {
    color?: InputColor;
    addon?: ReactNode;
    icon?: FC<ComponentProps<'svg'>>;
    rightIcon?: FC<ComponentProps<'svg'>>;
    helperText?: ReactNode;
    inputRef?: ComponentRefType<HTMLInputElement>
} & ComponentPropsWithoutRef<'input'>;

export const TextInput = component<Props, HTMLDivElement>(
    'TextInput',
    function ({
        className,
        color: userColor = 'gray',
        addon,
        icon: Icon,
        rightIcon: RightIcon,
        helperText: userHelperText,
        myRef,
        inputRef,
        name,
        ...inputProps
    }) {
        const validationError = useContextSelector(FormContext, ({ validationErrors }) =>
            name ? validationErrors[name] : null
        );

        const color = validationError ? 'failure' : userColor;
        const helperText = validationError || userHelperText;

        return (
            <>
                <div ref={myRef} className={this.mcn(className)}>
                    {addon && <span className={this.__('Addon')}>{addon}</span>}
                    <div className={this.__('Field')}>
                        {Icon && (
                            <div className={this.__('Icon', ['left'])}>
                                <Icon />
                            </div>
                        )}
                        {RightIcon && (
                            <div className={this.__('Icon', ['right'])}>
                                <RightIcon />
                            </div>
                        )}
                        <input
                            ref={inputRef}
                            className={this.__('Input', {
                                withAddon: !!addon,
                                withIcon: !!Icon,
                                withRightIcon: !!RightIcon,
                                [color]: true,
                            })}
                            type='text'
                            name={name}
                            {...inputProps}
                        />
                    </div>
                </div>
                {helperText && <p className={this.__('HelperText', [color])}>{helperText}</p>}
            </>
        );
    }
);
