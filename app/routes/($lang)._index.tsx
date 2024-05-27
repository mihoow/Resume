import Actions from '~/components/Actions/Actions';
import { type ChangeEvent } from 'react';
import LanguageSwitch from '~/components/LanguageSwitch/LanguageSwitch';
import { json} from '@remix-run/node';
import type { TypedResponse, ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import Resume from '~/components/Resume/Resume';
import bem from 'bem-ts';
import pageStyles from '../styles/cv.css';
import { useDebounce } from 'use-debounce';
import { namedAction } from 'remix-utils/named-action';
import type { ActionData } from '~/types/global';
import { ActionType } from '~/config';
import { getAuthSession, handleAdminAuth } from '~/services/adminAuth.server';

export const action = async ({ request }: ActionFunctionArgs): Promise<TypedResponse<ActionData>> => {
    const formData = await request.formData()

    return namedAction(formData, {
        [ActionType.AUTH]: () => handleAdminAuth(request, formData)
    });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { isAdmin } = await getAuthSession(request)

    return json({ isAdmin })
}

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pageStyles }];

const __ = bem('CVPage');

export default function CVPage() {
    const isAdmin = false;

    const [companyName, setCompanyName] = useDebounce('', 100);

    return (
        <div className={__()}>
            <header className={__('Header')}>
                <LanguageSwitch />
            </header>
            <main className={__('Main')}>
                <div className={__('AdminForm')}>
                    <input
                        className={__('CompanyInput')}
                        type='text'
                        placeholder='Company name'
                        value={companyName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
                    />
                </div>
                <Actions className={__('Actions')} />
                <Resume
                    className={__('Resume')}
                    companyName={companyName}
                    isAdmin={isAdmin}
                />
            </main>
        </div>
    );
}
