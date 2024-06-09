import type { TFunction } from '~/types/global';
import { getFixedT } from '~/utils/internationalization';
import { useLocale } from './useLocale';
import { useMemo } from 'react';

export function useTranslation(): TFunction {
    const locale = useLocale();

    return useMemo(() => getFixedT(locale), [locale])
}
