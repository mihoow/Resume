import type { ComponentPropsWithoutRef } from 'react';
import { Spinner } from '../Spinner/Spinner';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

export type ButtonProps = {
    variant?: 'default' | 'danger' | 'submit';
    isLoading?: boolean;
    loadingText?: string;
} & ComponentPropsWithoutRef<'button'>;

export const Button = component<ButtonProps, HTMLButtonElement>(
    'Button',
    function ({ className, variant = 'default', isLoading, loadingText, myRef, children, ...props }) {
        const t = useTranslation();

        return (
            <button
                ref={myRef}
                className={this.cn(this.__([variant]), className)}
                {...props}
            >
                <span className={this.__('Content', { isLoading })}>
                    {isLoading && <span className={this.__('SpinnerSlot')}><Spinner /></span>}
                    {isLoading ? (loadingText || t('Processing..', 'Przetwarzanie..')) : children}
                </span>
            </button>
        );
    }
);
