import type { PropsWithChildren, ReactNode } from 'react';
import { formatPhoneNumber, trimUrl } from '~/utils/contact';

import { AUTHOR } from '~/config';
import CopyToClipboard from '~/base/CopyToClipboard/CopyToClipboard';
import GithubIcon from '~/icons/Github';
import Link from '~/base/Link';
import LinkedinIcon from '~/icons/Linkedin';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

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

const SocialLink = component<{
    icon: ReactNode;
    link: string;
}>('SocialLink', function ({ className, icon, link }) {
    return (
        <Link
            className={this.mcn(className)}
            type='native'
            newTab
            to={link}
        >
            <div className={this.__('Icon')}>{icon}</div>
            <span>{trimUrl(link)}</span>
        </Link>
    );
});

export default component('Contacts', function ({ className }) {
    const t = useTranslation();
    const { birthday, address, email, github, linkedin, phone } = AUTHOR;

    return (
        <div className={this.mcn(className)}>
            <div className={this.__('ContactList')}>
                <ContactItem title={t('Date of birth', 'Data urodzenia')}>{birthday}</ContactItem>
                <ContactItem title={t('Address', 'Adres')}>
                    <Link
                        type='native'
                        newTab
                        to='https://www.google.com/maps/place/99-434+Domaniewice'
                    >
                        {address}
                    </Link>
                    <CopyToClipboard value={address} />
                </ContactItem>
                <ContactItem title={t('Phone', 'Telefon')}>
                    <Link
                        type='native'
                        to={`tel:${phone.tel}`}
                    >
                        {`(+${phone.areaCode}) ${formatPhoneNumber(phone.tel)}`}
                    </Link>
                    <CopyToClipboard value={`(+${phone.areaCode}) ${formatPhoneNumber(phone.tel)}`} />
                </ContactItem>
                <ContactItem title={t('E-mail')}>
                    <Link
                        newTab
                        to='../contact-me'
                    >
                        {email}
                    </Link>
                    <CopyToClipboard value={email} />
                </ContactItem>
            </div>
            <div className={this.__('SocialLinks')}>
                <SocialLink
                    icon={<LinkedinIcon />}
                    link={linkedin}
                />
                <SocialLink
                    icon={<GithubIcon />}
                    link={github}
                />
            </div>
        </div>
    );
});
