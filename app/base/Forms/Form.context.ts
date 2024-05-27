import type { ValidationErrorData } from '~/types/global';
import { createContext } from 'use-context-selector';

export type FormContextType = {
    intent: string;
    isSubmitting: boolean;
    validationErrors: ValidationErrorData['validationErrors'];
};

export const FormContext = createContext<FormContextType>({ intent: '', isSubmitting: false, validationErrors: {} });
