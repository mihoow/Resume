import { createContext } from 'use-context-selector';
import { noopFn } from '~/utils/misc';

export type ModalContextType = {
    headerId: string;
    popup: boolean;
    onClose: VoidFunction;
};

export const ModalContext = createContext<ModalContextType>({ headerId: '', popup: false, onClose: noopFn });
