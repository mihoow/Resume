import Actions from '~/components/Actions/Actions';
import { type ChangeEvent } from 'react';
import LanguageSwitch from '~/components/LanguageSwitch/LanguageSwitch';
import type { LinksFunction } from '@remix-run/node';
import Resume from '~/components/Resume/Resume';
import bem from 'bem-ts';
import pageStyles from '../styles/cv.css';
import { useDebounce } from 'use-debounce';

export const action = () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(null), 2000)
    })
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