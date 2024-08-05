import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { ActionType, DEFAULT_LOCALE } from '~/config';
import { redirect, useActionData, useNavigate, useOutletContext } from '@remix-run/react';
import { useCallback, useEffect, useMemo } from 'react';

import type { AboutMeDocument } from '@letter/type';
import { EditAboutMeModal } from '@letter/components/EditAboutMeModal/EditAboutMeModal';
import { ModalHandle } from '~/types/global';
import { ToastsListContext } from '~/base/Toast/ToastList.context';
import { component } from '~/utils/component';
import { getUserSession } from '~/services/userSession';
import { isSupportedLocale } from '~/utils/internationalization';
import { noopFn } from '~/utils/misc';
import pageStyles from '~/styles/pages/about-me-edit.css?url';
import { saveAboutMeDocument } from '@letter/services/aboutMe.server';
import { useContext } from 'use-context-selector';
import { useHydrated } from 'remix-utils/use-hydrated';
import { useMirrorRef } from '~/hooks/useMirrorRef';

export const action = async ({ request, params: { lang } }: ActionFunctionArgs) => {
    return saveAboutMeDocument(request, isSupportedLocale(lang) ? lang : DEFAULT_LOCALE);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const userSession = await getUserSession(request);

    if (!userSession.isAdmin) {
        throw redirect('..');
    }

    return null;
}

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pageStyles }];

export default component('EditCoverLetter', function () {
    const navigate = useNavigate();
    const isHydrated = useHydrated();
    const actionData = useActionData<typeof action>();
    const { showToast, clearFailureMessages } = useContext(ToastsListContext);

    const { html } = useOutletContext<AboutMeDocument>();

    const handleNavigateBack = useCallback(() => {
        const {
            location: { search },
        } = window;

        clearFailureMessages(ActionType.EDIT_ABOUT_ME);
        navigate({ pathname: '..', search }, { preventScrollReset: true });
    }, [clearFailureMessages]);

    const effectArgs = useMirrorRef({ showToast });

    useEffect(() => {
        if (!actionData) return;

        const { showToast } = effectArgs.current;
        const { type, message, messageBody } = actionData;

        showToast({
            intent: ActionType.EDIT_ABOUT_ME,
            type,
            message,
            messageBody,
            autoClose: type === 'success',
        });
    }, [actionData]);

    const handle: ModalHandle = useMemo(
        () => ({
            isOpen: true,
            close: handleNavigateBack,
            open: noopFn,
        }),
        [handleNavigateBack]
    );

    if (!isHydrated) return null;

    return (
        <EditAboutMeModal
            handle={handle}
            html={html}
        />
    );
});
