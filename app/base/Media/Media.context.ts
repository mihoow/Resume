import type { Breakpoint } from "./Media.type";
import { createContext } from "use-context-selector";

export type MediaContextType = {
    shouldMatchSSR: boolean;
    activeBreakpoints: Breakpoint[];
};

const MEDIA_CONTEXT_VALUE: MediaContextType = {
    shouldMatchSSR: true,
    activeBreakpoints: ['mobile']
};

export const MediaContext = createContext<MediaContextType>(MEDIA_CONTEXT_VALUE);
