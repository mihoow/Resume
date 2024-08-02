import type { Locale, TFunction } from '~/types/global';

import { getFixedT } from '~/utils/internationalization';
import { useLocale } from './useLocale';
import { useMemo } from 'react';

export function useTranslation(languageOverride?: Locale): TFunction {
    const locale = useLocale();
    const language = languageOverride || locale;

    return useMemo(() => getFixedT(language), [language])
}
