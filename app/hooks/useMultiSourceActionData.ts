import { useActionData, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';

import type { ActionData } from '~/types/global';
import { isActionData } from '~/utils/misc';

export function useMultiSourceActionData(): ActionData | null {
    const [actionData, setActionData] = useState<ActionData | null>(null);

    const dataFromResponse = useActionData();
    const loaderData = useLoaderData();


    useEffect(() => {
        if (!isActionData(dataFromResponse)) return;

        setActionData(dataFromResponse);
    }, [dataFromResponse]);

    useEffect(() => {
        if (!loaderData || typeof loaderData !== 'object') return;

        if ('actionData' in loaderData) {
            const { actionData: dataFromSession } = loaderData;

            if (!isActionData(dataFromSession)) return;

            setActionData(dataFromSession);
        }
    }, [loaderData]);

    return actionData;
}
