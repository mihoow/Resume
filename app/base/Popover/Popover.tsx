import type { ComponentProps, ComponentPropsWithRef, ReactNode } from 'react';
import { ComponentPropsWithoutRef, cloneElement, isValidElement, useMemo, useRef, useState } from 'react';
import {
    FloatingFocusManager,
    arrow,
    autoPlacement,
    autoUpdate,
    flip,
    offset,
    safePolygon,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useHover,
    useInteractions,
    useMergeRefs,
    useRole,
} from '@floating-ui/react';

import type { Placement } from '@floating-ui/react';
import { component } from '~/utils/component';

type Props = {
    content: ReactNode;
    withArrow?: boolean;
    placement?: 'auto' | Placement;
    trigger?: 'hover' | 'click';
    initialOpen?: boolean;
};

function getArrowPlacement(placement: Placement): Placement {
    return {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
    }[placement.split('-')[0]] as Placement;
}

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
        const arrowRef = useRef<HTMLDivElement>(null);
        const [isOpen, setIsOpen] = useState(initialOpen);

        const {
            floatingStyles,
            context,
            placement: usedPlacement,
            middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
            refs,
        } = useFloating({
            placement: placement === 'auto' ? undefined : placement,
            open: isOpen,
            onOpenChange: setIsOpen,
            whileElementsMounted: autoUpdate,
            middleware: [
                offset(8),
                placement === 'auto' ? autoPlacement() : flip(),
                shift({ padding: 8 }),
                arrow({ element: arrowRef.current }),
            ],
        });

        const { getFloatingProps, getReferenceProps } = useInteractions([
            useClick(context, { enabled: trigger === 'click' }),
            useHover(context, {
                enabled: trigger === 'hover',
                handleClose: safePolygon(),
                delay: { open: 100, close: 0 },
            }),
            useDismiss(context),
            useRole(context, { role: 'dialog' }),
        ]);

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
