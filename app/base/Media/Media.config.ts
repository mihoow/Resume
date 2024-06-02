import type { Breakpoint } from "./Media.type";

export const BREAKPOINT_MAP: Readonly<Record<
    Breakpoint,
    { min: number; max: number }
>> = {
    smallMobile: { min: 0, max: 413 },
    mobile: { min: 414, max: 639 },
    wideMobile: { min: 640, max: 767 },
    tablet: { min: 768, max: 1023 },
    desktop: { min: 1024, max: 1439 },
    wideDesktop: { min: 1440, max: Infinity }
};