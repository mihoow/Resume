import { DebouncedState, useDebouncedCallback } from 'use-debounce';
import { useEffect, useMemo, useRef, useState } from 'react';

import { PreservedStateController } from '../features/RichTextEditor/type';

type Options = {
    key: string;
    defaultValue?: string;
};

export function usePreservedStateController(keyPrefix = ''): PreservedStateController {
    const stateSavers = useRef<Record<string, DebouncedState<(value: string) => void>>>({});

    useEffect(() => {
        Object.values(stateSavers.current).forEach((callback) => callback.flush());
    }, [keyPrefix])

    return useMemo(
        () => ({
            keyPrefix,
            saveAll() {
                Object.values(stateSavers.current).forEach((callback) => callback.flush());
            },
            flushStorage() {
                // clear timeouts
                Object.values(stateSavers.current).forEach((callback) => callback.cancel());

                Object.keys(stateSavers.current).forEach((storageKey) => {
                    sessionStorage.removeItem(storageKey);
                });
            },
            addStateSaver(storageKey, saverCallback) {
                stateSavers.current[storageKey] = saverCallback;
            },
        }),
        [keyPrefix]
    );
}

export function usePreservedState(
    { keyPrefix, addStateSaver }: PreservedStateController,
    { key, defaultValue = '' }: Options
): [string, (value: string) => void] {
    const storageKey = keyPrefix ? `${keyPrefix}-${key}` : key;

    const [initialValue] = useState(() => {
        const savedValue = sessionStorage.getItem(storageKey);

        return savedValue || defaultValue;
    });

    const debouncedSaveValue = useDebouncedCallback((value: string) => {
        sessionStorage.setItem(storageKey, value);
    }, 2000);

    useEffect(() => {
        // ? Because of this, it can be later removed from a storage when closing a modal
        addStateSaver(storageKey, debouncedSaveValue);
    }, [addStateSaver, storageKey, debouncedSaveValue]);

    return [initialValue, debouncedSaveValue];
}
