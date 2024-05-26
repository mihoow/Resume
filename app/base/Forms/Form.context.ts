import { createContext } from "use-context-selector";

export type FormContextType = {
    intent: string;
    isSubmitting: boolean;
}

export const FormContext = createContext<FormContextType>({ intent: '', isSubmitting: false });
