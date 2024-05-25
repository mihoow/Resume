import { useState, type FC, type PropsWithChildren, useEffect, useMemo, useRef } from "react";
import type { MediaContextType } from "./Media.context";
import { MediaContext } from "./Media.context";
import { useLocation } from "@remix-run/react";
import type { Breakpoint } from "./Media.type";
import { BREAKPOINT_MAP } from "./Media.config";

function getActiveBreakpoints(): Breakpoint[] {
    const { body: { offsetWidth: innerWidth } } = document;

    const matches = Object.entries(BREAKPOINT_MAP).reduce<Breakpoint[]>(
        (acc, [breakpoint, { min, max }]) => {
            const isMatch = innerWidth >= min && innerWidth <= max;

            if (isMatch) {
                return [...acc, (breakpoint as Breakpoint)];
            }

            return acc;
        },
        []
    );

    if (matches.length === 0) {
        return ['mobile'];
    }

    return matches;
}

const MediaProvider: FC<PropsWithChildren> = ({ children }) => {
    const [didLocationChange, setDidLocationChange] = useState(false);
    const [activeBreakpoints, setActiveBreakpoints] = useState<Breakpoint[]>(() => {
        if (!didLocationChange) {
            return ['mobile']
        }

        return getActiveBreakpoints()
    });
    const { pathname } = useLocation();

    const initialPathname = useRef(pathname);

    useEffect(() => {
        if (didLocationChange) {
            return;
        }

        if (pathname !== initialPathname.current) {
            setDidLocationChange(true)
        }
    }, [didLocationChange, pathname]);

    useEffect(() => {
        if (!didLocationChange) {
            return;
        }

        const listener = () => {
           setActiveBreakpoints((currBreakpoints) => {
                const newBreakpoints = getActiveBreakpoints();

                if (JSON.stringify(currBreakpoints) === JSON.stringify(newBreakpoints)) {
                    return currBreakpoints;
                }

                return newBreakpoints;
           });
        }

        listener();
        window.addEventListener('resize', listener);

        return () => {
            window.removeEventListener('resize', listener);
        }
    }, [didLocationChange]);

    const memoizedValue: MediaContextType = useMemo(() => ({
        shouldMatchSSR: !didLocationChange,
        activeBreakpoints
    }), [didLocationChange, activeBreakpoints])

    return (
        <MediaContext.Provider value={ memoizedValue }>
            { children }
        </MediaContext.Provider>
    );
};

export default MediaProvider;