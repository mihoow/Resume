import { Suspense, lazy } from 'react';

import type { TooltipProps } from './Tooltip';
import { component } from '~/utils/component';

const Tooltip = lazy(() => import('./Tooltip'));

export const LazyTooltip = component<TooltipProps>('LazyTooltip', function ({ children, ...props }) {
    return (
        <Suspense fallback={children}>
            <Tooltip {...props}>{children}</Tooltip>
        </Suspense>
    );
});

export default LazyTooltip;
