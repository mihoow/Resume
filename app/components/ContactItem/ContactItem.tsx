import { ReactNode, Suspense } from 'react';
import { formatPhoneNumber, trimUrl } from '~/utils/contact';

import { AUTHOR } from '~/config';
import { Await } from '@remix-run/react';
import CopyToClipboard from '~/base/CopyToClipboard';
import GithubIcon from '~/icons/Github';
import Link from '~/base/Link';
import LinkedinIcon from '~/icons/Linkedin';
import { SensitiveAuthorInfo } from '~/types/global';
import { Skeleton } from '~/base/Skeleton/Skeleton';
import { component } from '~/utils/component';
import { useRootData } from '~/hooks/useRootData';

export const SocialLink = component<{
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

export const LinkedinLink = component('LinkedinLink', function ({ className }) {
    const { linkedin } = AUTHOR;

    return (
        <SocialLink
            icon={<LinkedinIcon />}
            link={linkedin}
            className={className}
        />
    );
});

export const GithubLink = component('GithubLink', function ({ className }) {
    const { github } = AUTHOR;

    return (
        <SocialLink
            icon={<GithubIcon />}
            link={github}
            className={className}
        />
    );
});

// ****************************************
// ****************************************

export const SensitiveContact = component<{
    placeholder?: string;
    onLoad: (info: SensitiveAuthorInfo) => { content: ReactNode; textToCopy?: string };
}>('SensitiveContact', function ({ placeholder, onLoad }) {
    const sensitiveAuthorInfo = useRootData(({ sensitiveAuthorInfo }) => sensitiveAuthorInfo);

    return (
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

                    const { content, textToCopy } = onLoad(info);

                    return (
                        <>
                            {content}
                            {textToCopy && (
                                <CopyToClipboard
                                    value={textToCopy}
                                    className={this.__('CopyToClipboard')}
                                />
                            )}
                        </>
                    );
                }}
            </Await>
        </Suspense>
    );
});

export const AddressContact = component('AddressContact', function ({ className }) {
    return (
        <SensitiveContact
            className={className}
            placeholder='Street 99, 00-000 City'
            onLoad={({ address, addressLink }) => ({
                content: (
                    <Link
                        type='native'
                        newTab
                        to={addressLink}
                    >
                        {address}
                    </Link>
                ),
                textToCopy: address,
            })}
        />
    );
});

export const PhoneContact = component('PhoneContact', function ({ className }) {
    return (
        <SensitiveContact
            className={className}
            placeholder='(+00) 000 000 000'
            onLoad={({ phone: { code, tel } }) => {
                const phoneText = `(+${code}) ${formatPhoneNumber(tel)}`

                return {
                    content: (
                        <Link
                            type='native'
                            to={`tel:${tel}`}
                        >
                            {phoneText}
                        </Link>
                    ),
                    textToCopy: phoneText,
                }
            }}
        />
    );
});

export const EmailContact = component('EmailContact', function ({ className }) {
    return (
        <SensitiveContact
            className={className}
            placeholder='name.surname@mail.com'
            onLoad={({ email }) => ({
                content: <span>{email}</span>,
                textToCopy: email,
            })}
        />
    );
});
