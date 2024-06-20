import { Placement, arrow, autoPlacement, flip, offset, shift } from '@floating-ui/react';

import type { RefObject } from 'react';

export function getArrowPlacement(placement: Placement): Placement {
    return {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
    }[placement.split('-')[0]] as Placement;
}

export function getMiddlewares(placement: 'auto' | Placement, arrowRef?: RefObject<HTMLDivElement>) {
    const middlewares = [offset(8), placement === 'auto' ? autoPlacement() : flip(), shift({ padding: 8 })];

    if (arrowRef?.current) {
        return [...middlewares, arrow({ element: arrowRef.current })];
    }

    return middlewares;
}
