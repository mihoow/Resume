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

        const textContent = (() => {
            if (!isLoading) return children

            if (typeof loadingText === 'string') return loadingText

            return t('Processing..', 'Przetwarzanie..')
        })()

        const hasTextContent = !!textContent;

        return (
            <button
                ref={myRef}
                className={this.cn(this.__([variant]), className)}
                {...props}
            >
                <span className={this.__('Content', { isSpaced: isLoading && !!textContent })}>
                    {isLoading && (
                        <span className={this.__('SpinnerSlot', { hasLoadingText: hasTextContent })}>
                            <Spinner
                                size={hasTextContent ? 24 : 16}
                                className={this.__('Spinner')}
                            />
                        </span>
                    )}
                    {textContent}
                </span>
            </button>
        );
    }
);
