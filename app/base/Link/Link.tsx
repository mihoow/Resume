import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { NavLink, Link as RemixLink } from '@remix-run/react';
import type { RemixLinkProps, RemixNavLinkProps } from '@remix-run/react/dist/components';

import bem from 'bem-ts';
import { forwardRef } from 'react';

type LinkType = 'default' | 'nav' | 'native';

type SpaLinkProps = {
    newTab?: boolean;
};

type LinkAdditionalProps = {
    default: RemixLinkProps & SpaLinkProps;
    nav: RemixNavLinkProps & SpaLinkProps;
    native: ComponentPropsWithoutRef<'a'>;
};

type Props = {
    to: string;
    children: ReactNode;
    type?: LinkType;
    className?: string;
    icon?: ReactNode;
    withBorder?: boolean;
    isSilent?: boolean;
} & LinkAdditionalProps[LinkType];

function adjustProps<T extends LinkType>(
    type: T,
    to: string,
    initialProps: LinkAdditionalProps[T]
): LinkAdditionalProps[T] {
    const result = initialProps;

    if ('newTab' in result) {
        result.target = '_blank';
        result.rel = 'noreferrer noopener';

        Reflect.deleteProperty(result, 'newTab');
    }

    if (type === 'native') {
        (result as ComponentPropsWithoutRef<'a'>).href = to;

        if (to.includes('http')) {
            result.rel = 'noreferrer noopener';
        }
    } else {
        (result as RemixLinkProps | RemixNavLinkProps).to = to;
    }

    return result;
}

const TAG_BY_LINK_TYPE: Readonly<Record<LinkType, ElementType>> = {
    default: RemixLink,
    nav: NavLink,
    native: 'a',
};

const __ = bem('Link');

function renderChildren(children: ReactNode): ReactNode {
    if (typeof children === 'string') {
        return <span className={__('Text')}>{children}</span>;
    }

    return children;
}

const Link = forwardRef<HTMLAnchorElement, Props>(
    (
        {
            type = 'default',
            to,
            children,
            icon,
            className = '',
            withBorder = false,
            isSilent = type === 'nav',
            ...props
        },
        forwardedRef
    ) => {
        const Tag = TAG_BY_LINK_TYPE[type];

        const specificProps = adjustProps(type, to, props as Props);

        return (
            <Tag
                ref={forwardedRef}
                className={`${__({ withIcon: !!icon, withBorder, silent: isSilent })} ${className}`.trim()}
                {...specificProps}
            >
                {icon}
                {children && renderChildren(children)}
            </Tag>
        );
    }
);

Link.displayName = 'Link';

export default Link;
