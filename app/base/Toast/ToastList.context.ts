import type { ToastsListContextType } from './Toast.type';
import { createContext } from 'use-context-selector';
import { noopFn } from '~/utils/misc';

export const ToastsListContext = createContext<ToastsListContextType>({
    showToast: noopFn,
    clearFailureMessages: noopFn
});
