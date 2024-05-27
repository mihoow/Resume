import type { ToastData, ToastListRef, ToastState } from './Toast.type';
import { useImperativeHandle, useRef } from 'react';

import { Toast } from './Toast';
import { component } from '~/utils/component';
import { isSameToast } from '~/utils/misc';

export const ToastList = component<{ toasts: ToastState[]; onRemoval: (toastId: string) => void }, ToastListRef | null>(
    'ToastList',
    function ({ className, toasts, onRemoval, myRef }) {
        const toastsRef = useRef<ToastListRef>([]);

        useImperativeHandle(myRef, () => toastsRef.current);

        return (
            <ul className={this.mcn(className)}>
                {toasts.map((toastData) => {
                    const { id, type, message, messageBody, intent, autoClose } = toastData;

                    return (
                        <li key={id}>
                            <Toast
                                className={this.__('Toast')}
                                toastId={id}
                                type={type}
                                message={message}
                                messageBody={messageBody}
                                intent={intent}
                                autoClose={autoClose}
                                onRemoval={onRemoval}
                                isInsideList
                                myRef={(toastRef) => {
                                    if (!toastRef) {
                                        toastsRef.current = toastsRef.current.filter(
                                            (toast) => !isSameToast(toast, toastData)
                                        );
                                    } else {
                                        toastsRef.current.push({
                                            ...toastData,
                                            ...toastRef,
                                        });
                                    }
                                }}
                            />
                        </li>
                    );
                })}
            </ul>
        );
    }
);
