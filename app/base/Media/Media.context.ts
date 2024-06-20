import { MediaContextType } from "~/types/media";
import { createContext } from "use-context-selector";

const MEDIA_CONTEXT_VALUE: MediaContextType = {
    isFirstPageRender: true,
    activeBreakpoints: ['mobile'],
};

export const MediaContext = createContext<MediaContextType>(MEDIA_CONTEXT_VALUE);
