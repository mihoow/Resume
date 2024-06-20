import { BREAKPOINT_MAP } from "~/config";
import { Breakpoint } from "~/types/media";

export function getActiveBreakpoints(): Breakpoint[] {
    const {
        body: { offsetWidth: innerWidth },
    } = document;

    const matches = Object.entries(BREAKPOINT_MAP).reduce<Breakpoint[]>((acc, [breakpoint, { min, max }]) => {
        const isMatch = innerWidth >= min && innerWidth <= max;

        if (isMatch) {
            return [...acc, breakpoint as Breakpoint];
        }

        return acc;
    }, []);

    if (matches.length === 0) {
        return ['mobile'];
    }

    return matches;
}

export function parseMinMaxProps(
    min?: Breakpoint | null,
    max?: Breakpoint | null,
    minMax?: Breakpoint | null
): [Breakpoint, Breakpoint] {
    if (minMax) {
        return [minMax, minMax];
    }

    return [min || 'smallMobile', max || 'wideDesktop'];
}

export function handleWindowResize(listener: VoidFunction) {
    listener();
    window.addEventListener('resize', listener);

    return () => {
        window.removeEventListener('resize', listener);
    };
}

export function isBetweenBreakpoints(
    activeBreakpoints: Breakpoint[],
    minBreakpoint: Breakpoint,
    maxBreakpoint?: Breakpoint
) {
    return activeBreakpoints.some((breakpoint) => {
        const { min: activeBreakpointMin, max: activeBreakpointMax } = BREAKPOINT_MAP[breakpoint];
        const { min: minWidth } = BREAKPOINT_MAP[minBreakpoint || 'smallMobile'];
        const { max: maxWidth } = BREAKPOINT_MAP[maxBreakpoint || 'wideDesktop'];

        return activeBreakpointMin >= minWidth && activeBreakpointMax <= maxWidth;
    });
}
