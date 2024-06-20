import { Breakpoint, BreakpointsProps } from '~/types/media';
import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import { isBetweenBreakpoints, parseMinMaxProps } from '~/utils/media';

import { MediaContext } from './Media.context';
import { component } from '~/utils/component';
import { useContextSelector } from 'use-context-selector';

type ContainerProps = PropsWithChildren<BreakpointsProps & ComponentPropsWithoutRef<'div'>>;

type ComponentProps = PropsWithChildren<
    {
        min: Breakpoint;
        max: Breakpoint;
    } & ComponentPropsWithoutRef<'div'>
>;

const MediaComponent = component<ComponentProps>(
    'MediaComponent',
    function ({ className, min, max, myRef, children, ...props }) {
        return (
            <div
                ref={myRef}
                className={this.cn(`Media-min-${min}`, `Media-max-${max}`, className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

const MediaContainer = component<ContainerProps>(
    'MediaContainer',
    function ({ className, min: initialMin, max: initialMax, minMax, myRef, children, ...props }) {
        const [min, max] = parseMinMaxProps(initialMin, initialMax, minMax);

        const shouldRender = useContextSelector(MediaContext, ({ isFirstPageRender, activeBreakpoints }) =>
            isFirstPageRender ? true : isBetweenBreakpoints(activeBreakpoints, min, max)
        );

        if (!shouldRender) {
            return null;
        }

        return (
            <MediaComponent
                myRef={myRef}
                min={min}
                max={max}
                className={className}
                {...props}
            >
                {children}
            </MediaComponent>
        );
    }
);

export default MediaContainer;
