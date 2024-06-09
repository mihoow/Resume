import { useCallback, useState } from 'react';

import { useDebouncedCallback } from 'use-debounce';

export function usePreservedState(id: string, initialContent?: string) {
    const storageKey = `rich-text-${id}`;

    const [initialData] = useState(() => {
        const savedContent = sessionStorage.getItem(`${storageKey}:content`);
        const savedEmail = sessionStorage.getItem(`${storageKey}:email`);
        const savedTopic = sessionStorage.getItem(`${storageKey}:topic`);

        return {
            content: savedContent || initialContent,
            email: savedEmail || '',
            topic: savedTopic || '',
        };
    });

    const debouncedSaveContent = useDebouncedCallback((content: string) => {
        sessionStorage.setItem(`${storageKey}:content`, content);
    }, 2000);

    const debouncedSaveEmail = useDebouncedCallback((email: string) => {
        sessionStorage.setItem(`${storageKey}:email`, email);
    }, 2000);

    const debouncedSaveTopic = useDebouncedCallback((topic: string) => {
        sessionStorage.setItem(`${storageKey}:topic`, topic);
    }, 2000);

    const clearTimeouts = useCallback(() => {
        debouncedSaveContent.cancel();
        debouncedSaveEmail.cancel();
        debouncedSaveTopic.cancel();
    }, [debouncedSaveContent, debouncedSaveEmail, debouncedSaveTopic]);

    const saveAll = useCallback(() => {
        debouncedSaveContent.flush();
        debouncedSaveEmail.flush();
        debouncedSaveTopic.flush();
    }, [debouncedSaveContent, debouncedSaveEmail, debouncedSaveTopic]);

    const flushStorage = useCallback(() => {
        clearTimeouts();

        sessionStorage.removeItem(`${storageKey}:content`);
        sessionStorage.removeItem(`${storageKey}:email`);
        sessionStorage.removeItem(`${storageKey}:topic`);
    }, [clearTimeouts, storageKey]);

    return {
        initialData,
        saveContent: debouncedSaveContent,
        saveEmail: debouncedSaveEmail,
        saveTopic: debouncedSaveTopic,
        saveAll,
        flushStorage,
    };
}
