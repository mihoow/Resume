import { ComponentPropsWithoutRef, ReactNode, useEffect } from 'react';
import { Placement, autoUpdate, useFocus } from '@floating-ui/react';
import { useBaseFloating, useBaseInteractions } from '~/hooks/useFloating';

import { component } from '~/utils/component';
import { getArrowPlacement } from '~/utils/floating-ui';

type BaseProps = {
    content: ReactNode;
    placement?: 'auto' | Placement;
    trigger?: 'hover' | 'click';
    theme?: 'light' | 'dark';
    isEnabled?: boolean;
};

export type TooltipProps = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export const Tooltip = component<TooltipProps>(
    'Tooltip',
    function ({
        className,
        content,
        placement = 'auto',
        trigger = 'hover',
        theme = 'dark',
        isEnabled = true,
        children,
        ...props
    }) {
        const {
            isOpen,
            arrowRef,
            floatingProperties: {
                context,
                middlewareData: { arrow: { x: arrowX = null, y: arrowY = null } = {} },
                refs,
                strategy,
                update,
                x,
                y,
                placement: usedPlacement,
            },
        } = useBaseFloating({
            placement,
        });

        const focus = useFocus(context);
        const { getFloatingProps, getReferenceProps } = useBaseInteractions({
            context,
            role: 'tooltip',
            trigger,
            interactions: [focus],
        });

        useEffect(() => {
            if (refs.reference.current && refs.floating.current && isOpen) {
                return autoUpdate(refs.reference.current, refs.floating.current, update);
            }
        }, [isOpen, refs.floating, refs.reference, update]);

        return (
            <>
                <div
                    ref={refs.setReference}
                    className={this.__('Target')}
                    {...getReferenceProps()}
                >
                    {children}
                </div>
                {isEnabled && (
                    <div
                        ref={refs.setFloating}
                        {...getFloatingProps({
                            className: this.cn(this.__({ isOpen, [theme]: true }), className),
                            style: {
                                position: strategy,
                                top: y || ' ',
                                left: x || ' ',
                            },
                            ...props,
                        })}
                    >
                        <div className={this.__('Content')}>{content}</div>
                        <div
                            ref={arrowRef}
                            className={this.__('Arrow', [theme])}
                            style={{
                                top: arrowY || ' ',
                                left: arrowX || ' ',
                                right: ' ',
                                bottom: ' ',
                                [getArrowPlacement(usedPlacement)]: '-4px',
                            }}
                        >
                            &nbsp;
                        </div>
                    </div>
                )}
            </>
        );
    }
);

export default Tooltip;
