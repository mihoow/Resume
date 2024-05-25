import type { TFunction } from '~/types/global';
import { useCallback } from 'react';
import { useLocale } from './useLocale';

export function useTranslation(): TFunction {
    const locale = useLocale();

    return useCallback(
        <En = string, Pl = string>(enVersion: En, plVersion: Pl) => {
            if (plVersion === undefined) return enVersion;

            if (locale === 'pl') return plVersion;

            return enVersion;
        },
        [locale]
    );
}
