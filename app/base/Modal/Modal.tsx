import type { ComponentPropsWithoutRef, ElementType } from 'react';
import {
    FloatingFocusManager,
    FloatingOverlay,
    FloatingPortal,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
} from '@floating-ui/react';
import { useEffect, useId, useMemo, useRef } from 'react';

import type { ComponentThis } from '~/utils/component';
import { ModalBody } from './ModalBody';
import { ModalContext } from './Modal.context';
import type { ModalContextType } from './Modal.context';
import { ModalFooter } from './ModalFooter';
import { ModalHeader } from './ModalHeader';
import { component } from '~/utils/component';
import { noopFn } from '~/utils/misc';

type Props<E extends ElementType> = {
    show?: boolean;
    onClose?: VoidFunction;
    dismissible?: boolean;
    popup?: boolean;
    as?: E;
};

function Modal<E extends ElementType = 'div'>(
    this: ComponentThis,
    {
        className,
        show = true,
        onClose = noopFn,
        dismissible = false,
        popup = false,
        children,
        as,
        ...props
    }: Props<E> & Omit<ComponentPropsWithoutRef<E>, keyof Props<E>>
) {
    const closeRef = useRef<HTMLButtonElement | null>(null);
    const headerId = useId();
    const { context } = useFloating({
        open: show,
        onOpenChange: onClose,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown', enabled: dismissible });
    const role = useRole(context);

    const { getFloatingProps } = useInteractions([click, dismiss, role]);

    const memoizedContextValue: ModalContextType = useMemo(
        () => ({ popup, onClose, headerId, closeRef }),
        [popup, onClose, headerId]
    );

    useEffect(() => {
        console.log('>>', closeRef)
    }, [])

    if (!show) {
        return null;
    }

    const DynamicComponent = as || 'div';

    return (
        <ModalContext.Provider value={memoizedContextValue}>
            <FloatingPortal>
                <FloatingOverlay
                    lockScroll
                    className={this.cn(this.__(), className)}
                >
                    <FloatingFocusManager context={context} initialFocus={closeRef}>
                        <DynamicComponent
                            ref={context.refs.setFloating}
                            role='dialog'
                            aria-labelledby={headerId}
                            className={this.__('Content')}
                            {...getFloatingProps(props)}
                        >
                            <div className={this.__('InnerContent')}>{children}</div>
                        </DynamicComponent>
                    </FloatingFocusManager>
                </FloatingOverlay>
            </FloatingPortal>
        </ModalContext.Provider>
    );
}

export default Object.assign(component('Modal', Modal) as unknown as typeof Modal, {
    Header: ModalHeader,
    Body: ModalBody,
    Footer: ModalFooter,
});
