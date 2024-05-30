import type { RootData } from '~/types/global';
import { RootDataContext } from '~/components/RootDataProvider/RootData.context';
import { useContextSelector } from 'use-context-selector';

export function useRootData<T>(selector: (data: RootData) => T) {
    return useContextSelector(RootDataContext, (data) => {
        if (!data) throw Error('Every components is expected to be inside `RootDataProvider`');

        return selector(data);
    });
}

export function useIsAdmin() {
    return useRootData(({ isAdmin }) => isAdmin)
}