import { createContext } from 'use-context-selector';

export type FormContextType = {
    intent: string;
    isSubmitting: boolean;
    validationErrors: Record<string, string>;
};

export const FormContext = createContext<FormContextType>({ intent: '', isSubmitting: false, validationErrors: {} });
