import { createContext } from 'use-context-selector';

export type FormContextType = {
    intent: string;
    isSubmitting: boolean;
    validationErrors: Record<string, string>;
};

export const FORM_DEFAULT_CONTEXT: FormContextType = { intent: '', isSubmitting: false, validationErrors: {} };

export const FormContext = createContext<FormContextType>(FORM_DEFAULT_CONTEXT);
