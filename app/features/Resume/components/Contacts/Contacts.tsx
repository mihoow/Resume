import { type PropsWithChildren } from 'react';

import { AUTHOR } from '~/config';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';
import {
    AddressContact,
    EmailContact,
    GithubLink,
    LinkedinLink,
    PhoneContact,
} from '~/components/ContactItem/ContactItem';

const ContactItem = component<
    PropsWithChildren<{
        title: string;
    }>
>('ContactItem', function ({ className, title, children }) {
    return (
        <div className={this.mcn(className)}>
            <span className={this.__('Title')}>{title}</span>
            {children}
        </div>
    );
});

export default component('Contacts', function ({ className }) {
    const t = useTranslation();
    const { birthday, github, linkedin } = AUTHOR;

    return (
        <div className={this.mcn(className)}>
            <div className={this.__('ContactList')}>
                <ContactItem title={t('Date of birth', 'Data urodzenia')}>{birthday}</ContactItem>
                <ContactItem title={t('Address', 'Adres')}>
                    <AddressContact />
                </ContactItem>
                <ContactItem title={t('Phone', 'Telefon')}>
                    <PhoneContact />
                </ContactItem>
                <ContactItem title={t('E-mail')}>
                    <EmailContact />
                </ContactItem>
            </div>
            <div className={this.__('SocialLinks')}>
                <LinkedinLink />
                <GithubLink />
            </div>
        </div>
    );
});
