import { EmailContact, GithubLink, LinkedinLink, PhoneContact } from '~/components/ContactItem/ContactItem';
import { Link, useLocation, useSearchParams } from '@remix-run/react';

import { CSSProperties } from 'react';
import { EmailIcon } from '../../icons/Email';
import { IMAGE_SIZES } from '../../config';
import { Page } from '~/config';
import { PhoneIcon } from '../../icons/Phone';
import { component } from '~/utils/component';
import { useIsAdmin } from '~/hooks/useRootData';
import { useTranslation } from '~/hooks/useTranslation';

export const LetterHeader = component('LetterHeader', function ({ className }) {
    const t = useTranslation();
    const isAdmin = useIsAdmin();

    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();

    const editPathname = (() => {
        if (!isAdmin) return null;

        const supportedPages: string[] = [Page.COVER_LETTER, Page.ABOUT_ME]
        const supportedPathname = supportedPages.find((pagePathname) => pathname.includes(pagePathname));

        return supportedPathname || null;
    })()

    return (
        <header
            className={this.mcn(className)}
            style={
                {
                    '--image-width': `${IMAGE_SIZES.width}px`,
                    '--image-height': `${IMAGE_SIZES.height}px`,
                } as CSSProperties
            }
        >
            <h1 className={this.__('NameSurname')}>Michał Wieczorek</h1>
            <div className={this.__('Contacts')}>
                <div className={this.__('ContactItem', ['phone'])}>
                    <PhoneIcon />
                    <PhoneContact />
                </div>
                <div className={this.__('ContactItem', ['email'])}>
                    <EmailIcon />
                    <EmailContact />
                </div>
                <GithubLink className={this.__('ContactItem', ['github'])} />
                <LinkedinLink className={this.__('ContactItem', ['linkedin'])} />
            </div>
            <img
                src='/images/profi-200x250.jpg'
                alt={t('my profile image', 'moje zdjęcie profilowe')}
                loading='eager'
                width={IMAGE_SIZES.width}
                height={IMAGE_SIZES.height}
                className={this.__('MyImage')}
            />
            {editPathname && (
                <Link
                    to={{
                        pathname: `.${editPathname}/edit`,
                        search: searchParams.toString(),
                    }}
                    prefetch='viewport'
                    preventScrollReset
                    className={this.__('EditLink')}
                >
                    Edit
                </Link>
            )}
        </header>
    );
});
