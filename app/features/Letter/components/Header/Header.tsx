import { EmailContact, GithubLink, LinkedinLink, PhoneContact } from '~/components/ContactItem/ContactItem';

import { CSSProperties } from 'react';
import { EmailIcon } from '../../icons/Email';
import { IMAGE_SIZES } from '../../config';
import { PhoneIcon } from '../../icons/Phone';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

export const LetterHeader = component('LetterHeader', function ({ className }) {
    const t = useTranslation();

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
                src='/images/profi.jpg'
                alt={t('my profile image', 'moje zdjęcie profilowe')}
                loading='eager'
                width={IMAGE_SIZES.width}
                height={IMAGE_SIZES.height}
                className={this.__('MyImage')}
            />
        </header>
    );
});
