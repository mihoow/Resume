import type { Breakpoint } from "./Media.type";

export const BREAKPOINT_MAP: Readonly<Record<
    Breakpoint,
    { min: number; max: number }
>> = {
    mobile: { min: 0, max: 720 },
    smallMobile: { min: 0, max: 414 },
    bigMobile: { min: 415, max: 720 },
    tablet: { min: 721, max: 1023 },
    desktop: { min: 1024, max: Infinity }
};