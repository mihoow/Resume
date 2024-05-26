import type { ComponentProps, ComponentPropsWithoutRef, FC, ReactNode } from 'react';

import { component } from '~/utils/component';

type InputColor =
    | 'gray'
    | 'info'
    | 'failure'
    | 'warning'
    | 'success';

type Props = {
    color?: InputColor;
    addon?: ReactNode;
    icon?: FC<ComponentProps<'svg'>>;
    rightIcon?: FC<ComponentProps<'svg'>>;
    helperText?: ReactNode;
} & ComponentPropsWithoutRef<'input'>;

export const TextInput = component<Props, HTMLInputElement>(
    'TextInput',
    function ({ className, color = 'gray', addon, icon: Icon, rightIcon: RightIcon, helperText, myRef, ...inputProps }) {
        return (
            <>
                <div className={this.mcn(className)}>
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
                            ref={myRef}
                            className={this.__('Input', {
                                withAddon: !!addon,
                                withIcon: !!Icon,
                                withRightIcon: !!RightIcon,
                                [color]: true
                            })}
                            type='text'
                            {...inputProps}
                        />
                    </div>
                </div>
                {helperText && <p className={this.__('HelperText', [color])}>{helperText}</p>}
            </>
        );
    }
);
