import { Suspense, type PropsWithChildren, type ReactNode } from 'react';
import { formatPhoneNumber, trimUrl } from '~/utils/contact';

import { AUTHOR } from '~/config';
import CopyToClipboard from '~/base/CopyToClipboard/CopyToClipboard';
import GithubIcon from '~/icons/Github';
import Link from '~/base/Link';
import LinkedinIcon from '~/icons/Linkedin';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';
import { useRootData } from '~/hooks/useRootData';
import { Skeleton } from '~/base/Skeleton/Skeleton';
import { Await } from '@remix-run/react';
import type { SensitiveAuthorInfo } from '~/types/global';

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

const SensitiveContactItem = component<{
    title: string;
    placeholder?: string;
    children: (info: SensitiveAuthorInfo) => ReactNode;
}>('SensitiveContactItem', function ({ className, title, placeholder, children }) {
    const sensitiveAuthorInfo = useRootData(({ sensitiveAuthorInfo }) => sensitiveAuthorInfo);

    return (
        <ContactItem
            title={title}
            className={this.mcn(className)}
        >
            <Suspense
                fallback={
                    <span className={this.__('Placeholder')}>
                        {placeholder}
                        <Skeleton className={this.__('Skeleton')} />
                    </span>
                }
            >
                <Await resolve={sensitiveAuthorInfo}>
                    {(info) => {
                        if (!info)
                            return <span className={this.__('Placeholder', { isBlurred: true })}>{placeholder}</span>;

                        return children(info);
                    }}
                </Await>
            </Suspense>
        </ContactItem>
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
    const { birthday, github, linkedin } = AUTHOR;

    return (
        <div className={this.mcn(className)}>
            <div className={this.__('ContactList')}>
                <ContactItem title={t('Date of birth', 'Data urodzenia')}>{birthday}</ContactItem>
                <SensitiveContactItem
                    title={t('Address', 'Adres')}
                    placeholder='Street 99, 00-000 City'
                >
                    {({ address, addressLink }) => (
                        <>
                            <Link
                                type='native'
                                newTab
                                to={addressLink}
                            >
                                {address}
                            </Link>
                            <CopyToClipboard value={address} />
                        </>
                    )}
                </SensitiveContactItem>
                <SensitiveContactItem
                    title={t('Phone', 'Telefon')}
                    placeholder="(+00) 000 000 000"
                >
                    {({ phone: { code, tel } }) => (
                        <>
                            <Link
                                type='native'
                                to={`tel:${tel}`}
                            >
                                {`(+${code}) ${formatPhoneNumber(tel)}`}
                            </Link>
                            <CopyToClipboard value={`(+${code}) ${formatPhoneNumber(tel)}`} />
                        </>
                    )}
                </SensitiveContactItem>
                <SensitiveContactItem
                    title={t('E-mail')}
                    placeholder="name.surname@mail.com"
                >
                    {({ email }) => (
                        <>
                            <span>{email}</span>
                            <CopyToClipboard value={email} />
                        </>
                    )}
                </SensitiveContactItem>
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
