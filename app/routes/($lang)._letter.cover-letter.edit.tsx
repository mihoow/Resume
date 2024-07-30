import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { CoverLetterDocument, CoverLetterTemplate } from '~/features/Letter/type';
import { getListOfTemplates, getTemplate, saveCoverLetter } from '~/features/Letter/service.server';
import { json, useLoaderData, useOutletContext } from '@remix-run/react';

import { DEFAULT_LOCALE } from '~/config';
import { EditModal } from '@letter/components/EditModal/EditModal';
import { component } from '~/utils/component';
import { getUserSession } from '~/services/userSession';
import { isSupportedLocale } from '~/utils/internationalization';
import pageStyles from '../styles/pages/letter-edit.css?url';
import { promiseHash } from 'remix-utils/promise';

export const action = async ({ request }: ActionFunctionArgs) => {
    return saveCoverLetter(request);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const userSession = await getUserSession(request);

    if (!userSession.isAdmin) {
        throw redirect('..');
    }

    const { searchParams } = new URL(request.url);
    const currentTemplateName = searchParams.get('temp') || 'none';
    const currentTemplateLanguage = searchParams.get('tempLang');

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

    return (
        <EditModal
            data={letter}
            templates={templates}
            currentTemplate={currentTemplate}
        />
    );
});
