import { useEffect, useState } from 'react';

import type { Breakpoint } from '../type';

function getCurrentBreakpoint(): Breakpoint {
    const { innerWidth, innerHeight } = window;

    if (innerWidth < 768 || innerHeight < 768) return 'mobile';

    return 'desktop';
}

export function useBreakpoints() {
    const [currBreakpoint, setCurrBreakpoint] = useState(getCurrentBreakpoint);

    useEffect(() => {
        const listener = () => {
            setCurrBreakpoint(getCurrentBreakpoint());
        };

        window.addEventListener('resize', listener);

        return () => {
            window.removeEventListener('resize', listener);
        };
    }, []);

    return currBreakpoint;
}
