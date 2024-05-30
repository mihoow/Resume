import type { RootData } from "~/types/global";
import { createContext } from "use-context-selector";

export const RootDataContext = createContext<RootData | null>(null);
