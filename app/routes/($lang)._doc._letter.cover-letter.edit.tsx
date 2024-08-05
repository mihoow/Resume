import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { ActionType, DEFAULT_LOCALE } from '~/config';
import type { CoverLetterDocument, CoverLetterTemplate } from '@letter/type';
import { TEMPLATE_LANGUAGE_QUERY_PARAM, TEMPLATE_QUERY_PARAM } from '@letter/config';
import { getListOfTemplates, getTemplate, saveCoverLetter } from '@letter/services/coverLetter.server';
import { json, useActionData, useLoaderData, useNavigate, useOutletContext, useSearchParams } from '@remix-run/react';
import { useCallback, useEffect } from 'react';

import { EditCoverLetterModal } from '~/features/Letter/components/EditCoverLetterModal/EditCoverLetterModal';
import { ToastsListContext } from '~/base/Toast/ToastList.context';
import { component } from '~/utils/component';
import { getUserSession } from '~/services/userSession';
import { isSupportedLocale } from '~/utils/internationalization';
import pageStyles from '../styles/pages/letter-edit.css?url';
import { promiseHash } from 'remix-utils/promise';
import { useContext } from 'use-context-selector';
import { useMirrorRef } from '~/hooks/useMirrorRef';

export const action = async ({ request }: ActionFunctionArgs) => {
    return saveCoverLetter(request);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const userSession = await getUserSession(request);

    if (!userSession.isAdmin) {
        throw redirect('..');
    }

    const { searchParams } = new URL(request.url);
    const currentTemplateName = searchParams.get(TEMPLATE_QUERY_PARAM) || 'none';
    const currentTemplateLanguage = searchParams.get(TEMPLATE_LANGUAGE_QUERY_PARAM);

    return json(
        await promiseHash({
            templates: getListOfTemplates(),
            currentTemplate: getTemplate(
                currentTemplateName,
                isSupportedLocale(currentTemplateLanguage) ? currentTemplateLanguage : DEFAULT_LOCALE
            ),
        })
    );
};

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pageStyles }];

export default component('EditCoverLetter', function () {
    const letter = useOutletContext<CoverLetterTemplate | CoverLetterDocument>();
    const { templates, currentTemplate } = useLoaderData<typeof loader>();

    const { showToast, clearFailureMessages } = useContext(ToastsListContext);
    const actionData = useActionData<typeof action>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleNavigateBack = useCallback(() => {
        clearFailureMessages(ActionType.EDIT_COVER_LETTER);

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(TEMPLATE_QUERY_PARAM);
        newSearchParams.delete(TEMPLATE_LANGUAGE_QUERY_PARAM);

        navigate({ pathname: '..', search: newSearchParams.toString() }, { preventScrollReset: true });
    }, [clearFailureMessages, searchParams]);

    const effectArgs = useMirrorRef({ showToast });

    useEffect(() => {
        if (!actionData) return;

        const { showToast } = effectArgs.current;
        const { type, message, messageBody } = actionData;

        showToast({
            intent: ActionType.EDIT_COVER_LETTER,
            type,
            message,
            messageBody,
            autoClose: type === 'success',
        });
    }, [actionData]);

    return (
        <EditCoverLetterModal
            data={letter}
            templates={templates}
            currentTemplate={currentTemplate}
            onClose={handleNavigateBack}
        />
    );
});
