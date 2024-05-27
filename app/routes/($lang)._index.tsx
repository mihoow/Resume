import Actions from '~/components/Actions/Actions';
import { type ChangeEvent } from 'react';
import LanguageSwitch from '~/components/LanguageSwitch/LanguageSwitch';
import { json} from '@remix-run/node';
import type { TypedResponse, ActionFunctionArgs, LinksFunction } from '@remix-run/node';
import Resume from '~/components/Resume/Resume';
import bem from 'bem-ts';
import pageStyles from '../styles/cv.css';
import { useDebounce } from 'use-debounce';
import { namedAction } from 'remix-utils/named-action';
import type { ActionData } from '~/types/global';

export const action = async ({ request }: ActionFunctionArgs): Promise<TypedResponse<ActionData>> => {
    const formData = await request.formData()

    const wait = () => new Promise((resolve) => {
        setTimeout(() => resolve({ ok: false }), 2000);
    })

    return namedAction(formData, {
        auth: async () => {
            await wait()

            const isSuccess = Math.random() > 0.1;

            const d: ActionData = isSuccess
                ? { intent: 'auth', ok: true, message: 'Everything is fine' }
                : { intent: 'auth', ok: false, message: 'Oops! Server error' }

            // const d: ActionData = { intent: 'auth', ok: false, validationErrors: { password: 'Incorrect password!' } }

            return json(d)
        }
    });
};

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
