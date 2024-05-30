import type { PropsWithChildren } from 'react';
import type { RootData } from '~/types/global';
import { RootDataContext } from './RootData.context';
import { component } from '~/utils/component';

export const RootDataProvider = component<PropsWithChildren<{ data: RootData }>>(
    'RootDataProvider',
    function ({ data, children }) {
        return <RootDataContext.Provider value={data}>{children}</RootDataContext.Provider>;
    }
);
