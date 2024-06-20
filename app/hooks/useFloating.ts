import {
    ElementProps,
    Placement,
    ReferenceType,
    UseRoleProps,
    autoUpdate,
    safePolygon,
    useClick,
    useDismiss,
    useFloating,
    useHover,
    useInteractions,
    useRole,
} from '@floating-ui/react';
import { useRef, useState } from 'react';

import { getMiddlewares } from '~/utils/floating-ui';

type UseFloatingArgs = {
    initialOpen?: boolean;
    placement?: 'auto' | Placement;
};

type UseInteractionsArgs = {
    context: ReturnType<typeof useFloating>['context'];
    role: UseRoleProps['role'];
    trigger?: 'hover' | 'click';
    interactions?: ElementProps[];
};

export function useBaseFloating<T extends ReferenceType>({ initialOpen = false, placement = 'auto' }: UseFloatingArgs) {
    const arrowRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(initialOpen);

    const floatingProperties = useFloating<T>({
        placement: placement === 'auto' ? undefined : placement,
        open: isOpen,
        onOpenChange: setIsOpen,
        whileElementsMounted: autoUpdate,
        middleware: getMiddlewares(placement, arrowRef),
    });

    return {
        isOpen,
        arrowRef,
        floatingProperties,
    };
}

export function useBaseInteractions({ context, role, trigger, interactions = [] }: UseInteractionsArgs) {
    return useInteractions([
        useClick(context, { enabled: trigger === 'click' }),
        useHover(context, { enabled: trigger === 'hover', handleClose: safePolygon(), delay: { open: 100, close: 0 } }),
        useDismiss(context),
        useRole(context, { role }),
        ...interactions,
    ]);
}
