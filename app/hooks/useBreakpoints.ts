import {
    getActiveBreakpoints,
    getModalBreakpoint,
    handleWindowResize,
    isBetweenBreakpoints,
    parseMinMaxProps,
} from '~/utils/media';
import { useEffect, useState } from 'react';

import { BreakpointsProps } from '~/types/media';
import { pipe } from '~/utils/pipe';
import { useHydrated } from 'remix-utils/use-hydrated';

export function useBreakpoints({ min: initialMin, max: initialMax, minMax }: BreakpointsProps) {
    const [min, max] = parseMinMaxProps(initialMin, initialMax, minMax);

    const isHydrated = useHydrated();
    const [isMatch, setIsMatch] = useState(() => {
        if (!isHydrated) return null;

        return isBetweenBreakpoints(getActiveBreakpoints(), min, max);
    });

    useEffect(() => {
        return handleWindowResize(() =>
            pipe(
                getActiveBreakpoints,
                (activeBreakpoints) => isBetweenBreakpoints(activeBreakpoints, min, max),
                setIsMatch
            )
        );
    }, [min, max]);

    return isMatch;
}

export function useModalBreakpoint() {
    const [currBreakpoint, setCurrBreakpoint] = useState(getModalBreakpoint);

    useEffect(() => {
        return handleWindowResize(() => setCurrBreakpoint(getModalBreakpoint()));
    }, []);

    return currBreakpoint;
}
