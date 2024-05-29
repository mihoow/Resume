import Actions from '~/components/Actions/Actions';
import { type ChangeEvent } from 'react';
import LanguageSwitch from '~/components/LanguageSwitch/LanguageSwitch';
import { json } from '@remix-run/node';
import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import Resume from '~/components/Resume/Resume';
import bem from 'bem-ts';
import pageStyles from '../styles/cv.css';
import { useDebounce } from 'use-debounce';
import { namedAction } from 'remix-utils/named-action';
import { ActionType } from '~/config';
import { getUserSession, handleAdminAuth, handleAdminLogout } from '~/services/userSession';
import { useLoaderData } from '@remix-run/react';
import { TextInput } from '~/base/Forms/TextInput';
import { authorizeCompany, fetchCompany } from '~/services/companies.server';

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    return namedAction(formData, {
        [ActionType.ADMIN_AUTH]: () => handleAdminAuth(request, formData),
        [ActionType.ADMIN_LOGOUT]: () => handleAdminLogout(request),
        [ActionType.COMPANY_REGISTRATION]: () => authorizeCompany(request, formData)
    });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { isAdmin, actionData } = await getUserSession(request);
    const companyData = await fetchCompany(request);

    return json({ isAdmin, companyData, actionData });
};

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pageStyles }];

const __ = bem('CVPage');

export default function CVPage() {
    const { isAdmin } = useLoaderData<typeof loader>();

    const [companyName, setCompanyName] = useDebounce('', 100);

    return (
        <div className={__()}>
            <header className={__('Header')}>
                <LanguageSwitch />
            </header>
            <main className={__('Main')}>
                {isAdmin && (
                    <div className={__('AdminForm')}>
                        <TextInput
                            className={__('CompanyInput')}
                            type='text'
                            placeholder='Company name'
                            value={companyName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
                        />
                    </div>
                )}
                <Actions
                    className={__('Actions')}
                    isAdmin={isAdmin}
                />
                <Resume
                    className={__('Resume')}
                    companyName={companyName}
                    isAdmin={isAdmin}
                />
            </main>
        </div>
    );
}
