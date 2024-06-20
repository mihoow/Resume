import { useState, type FC, type PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { MediaContext } from './Media.context';
import { useLocation } from '@remix-run/react';
import { getActiveBreakpoints, handleWindowResize } from '~/utils/media';
import { Breakpoint, MediaContextType } from '~/types/media';

const MediaProvider: FC<PropsWithChildren> = ({ children }) => {
    const [didLocationChange, setDidLocationChange] = useState(false);
    const [activeBreakpoints, setActiveBreakpoints] = useState<Breakpoint[]>(() => {
        if (!didLocationChange) {
            return ['mobile'];
        }

        return getActiveBreakpoints();
    });

    const { pathname } = useLocation();
    const initialPathname = useRef(pathname);

    useEffect(() => {
        if (didLocationChange) {
            return;
        }

        if (pathname !== initialPathname.current) {
            setDidLocationChange(true);
        }
    }, [didLocationChange, pathname]);

    useEffect(() => {
        if (!didLocationChange) {
            return;
        }

        return handleWindowResize(() => {
            setActiveBreakpoints((currBreakpoints) => {
                const newBreakpoints = getActiveBreakpoints();

                if (JSON.stringify(currBreakpoints) === JSON.stringify(newBreakpoints)) {
                    return currBreakpoints;
                }

                return newBreakpoints;
            });
        });
    }, [didLocationChange]);

    const memoizedValue: MediaContextType = useMemo(
        () => ({
            isFirstPageRender: !didLocationChange,
            activeBreakpoints,
        }),
        [didLocationChange, activeBreakpoints]
    );

    return <MediaContext.Provider value={memoizedValue}>{children}</MediaContext.Provider>;
};

export default MediaProvider;
