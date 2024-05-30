import { useEffect, useState } from 'react';

import type { CompanyData } from '~/types/global';
import { KeyIcon } from '~/icons/Key';
import { Link } from '@remix-run/react';
import { Popover } from '~/base/Popover/Popover';
import { SearchIcon } from '~/icons/Search';
import { TextInput } from '~/base/Forms/TextInput';
import { component } from '~/utils/component';
import { useDebouncedCallback } from 'use-debounce';

export const FindCompany = component<{ companies: CompanyData[] }>('FindCompany', function ({ className, companies }) {
    const [searchPhrase, setSearchPhrase] = useState('');
    const [searchResults, setSearchResults] = useState(companies);

    const debouncedUpdateSearchResults = useDebouncedCallback((phrase: string) => {
        const adjustedPhrase = phrase.toLowerCase();
        const matchedCompanies = companies.filter(
            ({ code, name }) =>
                code.toLowerCase().includes(adjustedPhrase) || name?.toLowerCase()?.includes(adjustedPhrase)
        );

        setSearchResults(matchedCompanies);
    }, 300);

    useEffect(() => {
        debouncedUpdateSearchResults(searchPhrase);

        return () => debouncedUpdateSearchResults.cancel();
    }, [searchPhrase, debouncedUpdateSearchResults]);

    return (
        <div className={this.mcn(className)}>
            <Popover
                placement='bottom'
                trigger='hover'
                className={this.__('Popover')}
                content={
                    <ul className={this.__('List')}>
                        {searchResults.map(({ code, name, token }) => (
                            <li
                                key={code}
                                className={this.__('Item')}
                            >
                                <Link
                                    className={this.__('ItemLink')}
                                    to={{ search: `?token=${token}` }}
                                >
                                    {code}
                                    {name ? ` - ${name}` : ''}
                                </Link>
                            </li>
                        ))}
                    </ul>
                }
            >
                <TextInput
                    addon={<SearchIcon />}
                    type='search'
                    placeholder='Find company..'
                    value={searchPhrase}
                    onChange={({ target: { value } }) => setSearchPhrase(value)}
                />
            </Popover>
        </div>
    );
});

export default FindCompany;