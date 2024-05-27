import type { ToastData, ToastListRef, ToastState } from './Toast.type';
import { isActionData, isSameToast } from '~/utils/misc';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { PropsWithChildren } from 'react';
import type { ServerMessageKey } from '~/data/serverMessages';
import { ToastList } from './ToastList';
import { ToastsListContext } from './ToastList.context';
import { component } from '~/utils/component';
import { getServerMessages } from '~/data/serverMessages';
import { useActionData } from '@remix-run/react';
import { useData } from '~/hooks/useData';

export const ToastListProvider = component<PropsWithChildren>('ToastListProvider', function ({ children }) {
    const toastListRef = useRef<ToastListRef | null>(null);
    const actionData = useActionData();
    const serverMessages = useData(getServerMessages);
    const [toasts, setToasts] = useState<ToastState[]>([]);

    const handleShowToast = useCallback((newToast: ToastData) => {
        const { intent, message } = newToast;

        setToasts((currToasts) => {
            const isAlreadyThere = currToasts.some((toast) => isSameToast(toast, newToast));

            if (isAlreadyThere) {
                const sameToast = toastListRef.current?.find((toast) => isSameToast(toast, newToast));
                sameToast?.resetAnimation();

                return currToasts;
            }

            // This is to ensure only one message from a single form
            const filteredToasts = currToasts.filter((toast) => (toast.intent ? toast.intent !== intent : true));

            return [...filteredToasts, { ...newToast, id: message }];
        });
    }, []);

    const handleRemoval = useCallback((toastId: string) => {
        setToasts((currToasts) => currToasts.filter((toast) => toast.id !== toastId));
    }, []);

    const handleClearFailureMessages = useCallback((intent: string) => {
        const matchedToastRefs = toastListRef.current?.filter(
            (toast) => toast.intent === intent && toast.type === 'failure'
        );

        matchedToastRefs?.forEach(({ hide }) => hide());
    }, []);

    useEffect(() => {
        if (!isActionData(actionData) || !('message' in actionData)) return;

        const { intent, ok, message = '', messageBody } = actionData;

        handleShowToast({
            intent,
            type: ok ? 'success' : 'failure',
            message,
            messageBody,
            autoClose: ok
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionData]);

    const translatedToasts = useMemo(() => {
        return toasts.map((toast) => {
            const { message, messageBody } = toast;
            const toastCopy = { ...toast };

            if (message in serverMessages) {
                toastCopy.message = serverMessages[message as ServerMessageKey];
            }

            if (messageBody && messageBody in serverMessages) {
                toastCopy.messageBody = serverMessages[messageBody as ServerMessageKey];
            }

            return toastCopy;
        });
    }, [toasts, serverMessages]);

    return (
        <ToastsListContext.Provider
            value={{ showToast: handleShowToast, clearFailureMessages: handleClearFailureMessages }}
        >
            {toasts.length > 0 && (
                <ToastList
                    myRef={toastListRef}
                    toasts={translatedToasts}
                    onRemoval={handleRemoval}
                />
            )}
            {children}
        </ToastsListContext.Provider>
    );
});
