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
    placeholderLength?: number;
    children: (info: SensitiveAuthorInfo) => ReactNode;
}>('SensitiveContactItem', function ({ className, title, placeholderLength = 0.8, children }) {
    const sensitiveAuthorInfo = useRootData(({ sensitiveAuthorInfo }) => sensitiveAuthorInfo);

    const MAX_STARS = 40;

    return (
        <ContactItem
            title={title}
            className={this.mcn(className)}
        >
            <Suspense
                fallback={
                    <Skeleton
                        className={this.__('Skeleton')}
                        count={placeholderLength}
                    />
                }
            >
                <Await resolve={sensitiveAuthorInfo}>
                    {(info) => {
                        if (!info) return <span>{Array.from({ length: Math.floor(placeholderLength * MAX_STARS) }).fill('*').join('')}</span>;

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
                    placeholderLength={0.8}
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
                    placeholderLength={0.5}
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
                    placeholderLength={0.9}
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
