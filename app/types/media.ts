export type Breakpoint =
    | 'smallMobile'
    | 'mobile'
    | 'wideMobile'
    | 'tablet'
    | 'desktop'
    | 'wideDesktop';

export type MediaContextType = {
    isFirstPageRender: boolean;
    activeBreakpoints: Breakpoint[];
};

export type BreakpointsProps = {
    min?: Breakpoint | null;
    max?: Breakpoint | null;
    minMax?: Breakpoint | null;
};