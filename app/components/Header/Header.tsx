import { Link, NavLink, useLocation, useSearchParams } from '@remix-run/react';
import { getLinkToContact, getLinkToCoverLetter, getLinkToResume } from '~/utils/navigation';
import { useEffect, useRef, useState } from 'react';

import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';
import { ListIcon } from '~/icons/List';
import Media from '../../base/Media';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

const Heading = component('Heading', function ({ className }) {
    const t = useTranslation();

    return (
        <div className={this.mcn(className)}>
            <h1 className={this.__('Names')}>
                <span className='sr-only'>Michał Wieczorek</span>
                <span
                    aria-hidden
                    className={this.__('Name', ['first'])}
                >
                    <img
                        src='/logos/m.svg'
                        alt='M'
                        width={39.5}
                        height={40}
                        className={this.__('Logo')}
                        draggable={false}
                    />
                    <span>ichał</span>
                </span>
                <span
                    aria-hidden
                    className={this.__('Name', ['last'])}
                >
                    <img
                        src='/logos/m.svg'
                        alt='W'
                        height={40}
                        className={this.__('Logo', ['reversed'])}
                        draggable={false}
                    />
                    <span>ieczorek</span>
                </span>
            </h1>
            <strong
                aria-label={t('Job position', 'Posada')}
                className={this.__('Position')}
            >
                {t('Web Developer', 'Programista stron internetowych')}
            </strong>
        </div>
    );
});

const Navbar = component('Navbar', function ({ className }) {
    const listRef = useRef<HTMLUListElement>(null);
    const { pathname, search } = useLocation();
    const [searchParams] = useSearchParams();
    const t = useTranslation();

    const [isOpen, setIsOpen] = useState(false);

    const isContactOpen = searchParams.has('contact');

    useEffect(() => {
        const listener = ({ target }: MouseEvent) => {
            const { current: list } = listRef;

            const isClickInsideList = target instanceof Node && list?.contains(target);
            const isClickOnLink = target && 'tagName' in target && target.tagName === 'A';

            if (isClickInsideList && !isClickOnLink) return;

            setIsOpen(false);
        };

        if (!isOpen) return;

        document.addEventListener('click', listener);

        return () => {
            document.removeEventListener('click', listener);
        };
    }, [isOpen]);

    return (
        <nav className={this.cn(this.__({ isOpen }), className)}>
            <Media max='mobile'>
                <button
                    type='button'
                    onClick={() => setIsOpen(!isOpen)}
                    className={this.__('Toggler')}
                >
                    <ListIcon />
                </button>
            </Media>
            <ul
                ref={listRef}
                className={this.__('LinkList', { isOpen })}
            >
                <li>
                    <NavLink
                        to={getLinkToResume(pathname, search)}
                        preventScrollReset
                        prefetch='intent'
                        className={({ isActive }) => this.__('Link', { isActive })}
                    >
                        {t('Resume', 'Życiorys')}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to={getLinkToCoverLetter(pathname, search)}
                        preventScrollReset
                        prefetch='intent'
                        className={({ isActive }) => this.__('Link', { isActive })}
                    >
                        {t('Cover letter', 'List motywacyjny')}
                    </NavLink>
                </li>
                <li>
                    <Link
                        to={getLinkToContact(pathname, search)}
                        preventScrollReset
                        className={this.__('Link', { isActive: isContactOpen })}
                    >
                        {t('Contact', 'Kontakt')}
                    </Link>
                </li>
            </ul>
        </nav>
    );
});

export const Header = component('Header', function ({ className }) {
    return (
        <header className={this.mcn(className)}>
            <Heading className={this.__('Heading')} />
            <div className={this.__('Bar')}>
                <LanguageSwitch />
                <Navbar />
            </div>
        </header>
    );
});
