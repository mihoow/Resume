import { ModalContext } from './Modal.context';
import type { PropsWithChildren } from 'react';
import { component } from '~/utils/component';
import { useContextSelector } from 'use-context-selector';

export const ModalBody = component<PropsWithChildren>('ModalBody', function ({ className, children }) {
    const isPopup = useContextSelector(ModalContext, ({ popup }) => popup);

    return <div className={this.cn(this.__({ isPopup }), className)}>{children}</div>;
});
