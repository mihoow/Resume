import type { DataFunctionArgs } from '~/types/global';
import { useMemo } from 'react';
import { useTranslation } from './useTranslation';

export function useData<T>(dataFunction: (args: DataFunctionArgs) => T): T {
    const t = useTranslation();

    return useMemo(() => dataFunction({ t }), [dataFunction, t]);
}
