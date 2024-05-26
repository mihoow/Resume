import { createContext } from 'use-context-selector';
import { noopFn } from '~/utils/misc';

export type ModalContextType = {
    headerId: string;
    popup: boolean;
    onClose: VoidFunction;
    closeRef: { current: HTMLButtonElement | null };
};

export const ModalContext = createContext<ModalContextType>({
    headerId: '',
    popup: false,
    onClose: noopFn,
    closeRef: { current: null },
});
