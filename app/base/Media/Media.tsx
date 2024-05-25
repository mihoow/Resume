import type { ComponentPropsWithoutRef, ForwardedRef, PropsWithChildren, ReactElement } from 'react';
import { forwardRef, memo } from 'react';

import { BREAKPOINT_MAP } from './Media.config';
import type { Breakpoint } from './Media.type';
import { MediaContext } from './Media.context';
import bem from 'bem-ts';
import { useContextSelector } from 'use-context-selector';

type ContainerProps = PropsWithChildren<{
    min?: Breakpoint | null;
    max?: Breakpoint | null;
    minMax?: Breakpoint | null;
    className?: string;
}> & ComponentPropsWithoutRef<'div'>;

type ComponentProps = PropsWithChildren<{
    min: Breakpoint;
    max: Breakpoint;
} & ComponentPropsWithoutRef<'div'>>;

function parseMinMaxProps(
    min?: Breakpoint | null,
    max?: Breakpoint | null,
    minMax?: Breakpoint | null
): [Breakpoint, Breakpoint] {
    if (minMax) {
        return [minMax, minMax];
    }

    return [min || 'mobile', max || 'desktop'];
}

function getShouldRender(
    activeBreakpoints: Breakpoint[],
    minBreakpoint: Breakpoint,
    maxBreakpoint: Breakpoint
) {
   return activeBreakpoints.some((breakpoint) => {
        const { min: activeBreakpointMin, max: activeBreakpointMax } = BREAKPOINT_MAP[breakpoint];
        const { min: minWidth } = BREAKPOINT_MAP[minBreakpoint || 'mobile'];
        const { max: maxWidth } = BREAKPOINT_MAP[maxBreakpoint || 'desktop'];

        return activeBreakpointMin >= minWidth && activeBreakpointMax <= maxWidth;
   });
}

const __ = bem('Media');

const MediaComponent = memo(
    forwardRef<HTMLDivElement, ComponentProps>(
        ({ children, min, max, className = '', ...props }, forwardedRef) => (
            <div
               ref={ forwardedRef }
               className={ `${ __([`min-${ min }`, `max-${ max }`]) } ${ className }`.trim() }
               { ...props }
            >
                { children }
            </div>
        )
    )
);
MediaComponent.displayName = 'MediaComponent';

function MediaContainer({
    children,
    min: initialMin,
    max: initialMax,
    minMax: initialMinMax,
    className = '',
    ...props
}: ContainerProps, forwardedRef: ForwardedRef<HTMLDivElement>): ReactElement | null {
    const [min, max] = parseMinMaxProps(initialMin, initialMax, initialMinMax);

    const shouldRender = useContextSelector(
        MediaContext,
        ({ shouldMatchSSR, activeBreakpoints }) => shouldMatchSSR || getShouldRender(activeBreakpoints, min, max)
    );

    if (!shouldRender) {
        return null;
    }

    return (
        <MediaComponent
            ref={ forwardedRef }
            min={ min }
            max={ max }
            className={ className }
            { ...props }
        >
            { children }
        </MediaComponent>
    );
}

const EnhancedMedia = memo(
    forwardRef(MediaContainer)
);
EnhancedMedia.displayName = 'Media';

export default EnhancedMedia;
