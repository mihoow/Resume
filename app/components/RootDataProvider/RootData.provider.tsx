import { useState, type PropsWithChildren, useEffect } from 'react';
import type { RootData } from '~/types/global';
import { RootDataContext } from './RootData.context';
import { component } from '~/utils/component';

export const RootDataProvider = component<PropsWithChildren<{ data: RootData }>>(
    'RootDataProvider',
    function ({ data: loaderData, children }) {
        const [data, setData] = useState(loaderData);

        useEffect(() => {
            const { isAdmin, company, allCompanies, sensitiveAuthorInfo, actionData } = loaderData;

            setData((currData) => {
                if (JSON.stringify(company) !== JSON.stringify(currData.company)) {
                    currData.company = company;
                }

                return {
                    ...currData,
                    isAdmin,
                    allCompanies,
                    sensitiveAuthorInfo,
                    actionData,
                };
            });
        }, [loaderData]);

        return <RootDataContext.Provider value={data}>{children}</RootDataContext.Provider>;
    }
);
