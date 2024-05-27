import type { ToastData, ToastListRef } from './Toast.type';
import { isActionData, isSameToast } from '~/utils/misc';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { PropsWithChildren } from 'react';
import { ToastList } from './ToastList';
import { ToastsListContext } from './ToastList.context';
import { component } from '~/utils/component';
import { useActionData } from '@remix-run/react';

export const ToastListProvider = component<PropsWithChildren>('ToastListProvider', function ({ className, children }) {
    const toastListRef = useRef<ToastListRef | null>(null);
    const actionData = useActionData();
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const handleShowToast = useCallback((newToast: ToastData) => {
        const { intent } = newToast;

        setToasts((currToasts) => {
            const isAlreadyThere = currToasts.some((toast) => isSameToast(toast, newToast));

            if (isAlreadyThere) {
                const sameToast = toastListRef.current?.find((toast) => isSameToast(toast, newToast));
                console.log('>>same', sameToast)
                sameToast?.resetAnimation()

                return currToasts
            }

            // This is to ensure only one message from a single form
            const filteredToasts = currToasts.filter((toast) => (toast.intent ? toast.intent !== intent : true));

            return [...filteredToasts, newToast];
        });
    }, []);

    const handleRemoval = useCallback((toastToRemove: ToastData) => {
        console.log('>>removal', toastToRemove)
        setToasts((currToasts) => currToasts.filter((toast) => !isSameToast(toast, toastToRemove)));
    }, []);

    const handleClearFailureMessages = useCallback((intent: string) => {
        const matchedToastRefs = toastListRef.current?.filter(
            (toast) => toast.intent === intent && toast.type === 'failure'
        );

        matchedToastRefs?.forEach(({ hide }) => hide());
    }, []);

    useEffect(() => {
        if (!isActionData(actionData) || !('message' in actionData)) return;

        const { intent, ok, message = '' } = actionData;

        handleShowToast({ intent, type: ok ? 'success' : 'failure', message, autoClose: ok });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionData]);

    return (
        <ToastsListContext.Provider
            value={{ showToast: handleShowToast, clearFailureMessages: handleClearFailureMessages }}
        >
            {toasts.length > 0 && (
                <ToastList
                    myRef={toastListRef}
                    toasts={toasts}
                    onRemoval={handleRemoval}
                />
            )}
            {children}
        </ToastsListContext.Provider>
    );
});
