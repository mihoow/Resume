import type { ComponentProps, ComponentPropsWithRef, ReactNode } from 'react';
import {
    FloatingFocusManager,
    safePolygon,
    useClick,
    useDismiss,
    useHover,
    useInteractions,
    useMergeRefs,
    useRole,
} from '@floating-ui/react';
import { cloneElement, isValidElement, useMemo } from 'react';
import { useBaseFloating, useBaseInteractions } from '~/hooks/useFloating';

import type { Placement } from '@floating-ui/react';
import { component } from '~/utils/component';
import { getArrowPlacement } from '~/utils/floating-ui';

type Props = {
    content: ReactNode;
    withArrow?: boolean;
    placement?: 'auto' | Placement;
    trigger?: 'hover' | 'click';
    initialOpen?: boolean;
};

export const Popover = component<Props & Omit<ComponentProps<'div'>, keyof Props>>(
    'Popover',
    function ({
        className,
        content,
        withArrow = true,
        placement = 'bottom',
        trigger = 'click',
        initialOpen = false,
        children,
        ...props
    }) {
        const {
            isOpen,
            arrowRef,
            floatingProperties: {
                floatingStyles,
                context,
                placement: usedPlacement,
                middlewareData: { arrow: { x: arrowX = null, y: arrowY = null } = {} },
                refs,
            },
        } = useBaseFloating({
            initialOpen,
            placement,
        });

        const { getFloatingProps, getReferenceProps } = useBaseInteractions({ context, role: 'dialog', trigger })

        const childrenRef = (children as ComponentPropsWithRef<'button'>).ref;
        const ref = useMergeRefs([childrenRef, context.refs.setReference]);

        if (!isValidElement(children)) {
            throw Error('Invalid target element');
        }

        const target = useMemo(() => {
            return cloneElement(
                children,
                getReferenceProps({
                    ref,
                    myRef: ref,
                    ...children?.props,
                })
            );
        }, [children, ref, getReferenceProps]);

        return (
            <>
                {target}
                {isOpen && (
                    <FloatingFocusManager
                        context={context}
                        modal
                    >
                        <div
                            ref={refs.setFloating}
                            className={this.mcn(className)}
                            style={floatingStyles}
                            {...getFloatingProps(props)}
                        >
                            <div className={this.__('InnerWrapper')}>
                                {withArrow && (
                                    <div
                                        ref={arrowRef}
                                        className={this.__('Arrow')}
                                        style={{
                                            top: arrowY ?? ' ',
                                            left: arrowX ?? ' ',
                                            right: ' ',
                                            bottom: ' ',
                                            [getArrowPlacement(usedPlacement)]: '-4px',
                                        }}
                                    >
                                        &nbsp;
                                    </div>
                                )}
                                <div className={this.__('Content')}>{content}</div>
                            </div>
                        </div>
                    </FloatingFocusManager>
                )}
            </>
        );
    }
);
