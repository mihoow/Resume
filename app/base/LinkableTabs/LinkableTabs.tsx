import { CSSProperties, Children, ComponentPropsWithoutRef, ReactElement, useMemo, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from '@remix-run/react';

import { CaretLeftIcon } from '~/icons/CaretLeft';
import { CaretRightIcon } from '~/icons/CaretRight';
import { Page } from '~/config';
import { component } from '~/utils/component';
import { getLinkToPage } from '~/utils/navigation';
import { useBreakpoints } from '~/hooks/useBreakpoints';
import { useTranslation } from '~/hooks/useTranslation';

type TabLinkProps = {
    page: Page;
    children: string;
};

type TabsProps = {
    children: ReactElement<TabLinkProps>[];
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

const TabLink = component<TabLinkProps>('TabLink', function ({ className, children }) {
    return <div className={this.mcn(className)}>{children}</div>;
});

const LinkableTabs = component<TabsProps>('LinkableTabs', function ({ className, children, ...props }) {
    const navigationRef = useRef<HTMLDivElement>(null);

    const t = useTranslation();
    const navigate = useNavigate();
    const { pathname, search } = useLocation();
    const isTablet = !!useBreakpoints({ min: 'tablet' });

    const tabs = useMemo(
        () => Children.map(Children.toArray(children) as ReactElement<TabLinkProps>[], ({ props }) => ({
            ...props,
            link: getLinkToPage(pathname, search, props.page)
        })),
        [children, pathname, search]
    );

    const activeTabIndex = useMemo(() => {
        const reversedIndex = [...tabs].reverse().findIndex(({ page }) => {
            return pathname.includes(page);
        });

        return tabs.length - (reversedIndex + 1);
    }, [tabs, pathname]);

    const updateNavigationDirection = (deltaIndex: number) => {
        const { current: navigationElem } = navigationRef;

        if (!navigationElem) return;

        navigationElem.classList.remove(deltaIndex > 0 ? 'backwards' : 'forwards');
        navigationElem.classList.add(deltaIndex > 0 ? 'forwards' : 'backwards');
    };

    const handleGoTo = (deltaIndex: number) => {
        const {
            location: { pathname, search },
        } = window;

        const nextIndex = (() => {
            const naiveIndex = activeTabIndex + deltaIndex;

            if (naiveIndex < 0) return 0;

            if (naiveIndex >= tabs.length) return tabs.length - 1;

            return naiveIndex;
        })();

        const nextPageLink = tabs[nextIndex]?.link;

        if (!nextPageLink) return;

        updateNavigationDirection(deltaIndex);
        navigate(nextPageLink, { preventScrollReset: true });
    };

    const handleLinkClick = (index: number) => {
        const indexDelta = index - activeTabIndex;
        updateNavigationDirection(indexDelta);
    };

    const prevPage = tabs[activeTabIndex - 1]?.children || null;
    const nextPage = tabs[activeTabIndex + 1]?.children || null;

    return (
        <div
            aria-label={t('Switch between documents', 'Przełączaj między dokumentami')}
            className={this.mcn(className)}
            style={{ '--active-tab': activeTabIndex } as CSSProperties}
            {...props}
        >
            <div className={this.__('Track')}>
                {tabs.map(({ page, link, children: title }, index) => {
                    const sharedProps = {
                        className: this.__('Tab', { isActive: activeTabIndex === index }),
                        children: title,
                    };

                    // mobile case - non-interactive elements
                    if (!isTablet) {
                        return (
                            <span
                                key={page}
                                {...sharedProps}
                            />
                        );
                    }

                    return (
                        <NavLink
                            key={page}
                            to={link}
                            preventScrollReset
                            onClick={() => handleLinkClick(index)}
                            {...sharedProps}
                        />
                    );
                })}
            </div>
            <div
                ref={navigationRef}
                aria-hidden={isTablet}
                className={this.__('Navigation')}
            >
                <button
                    type='button'
                    className={this.__('NavigationButton')}
                    disabled={activeTabIndex === 0}
                    onClick={() => handleGoTo(-1)}
                    aria-label={prevPage ? t(`Navigate to ${prevPage}`, `Przejdź do ${prevPage}`) : ''}
                    tabIndex={isTablet ? -1 : 0}
                >
                    <CaretLeftIcon />
                </button>
                <button
                    type='button'
                    className={this.__('NavigationButton')}
                    disabled={activeTabIndex === tabs.length - 1}
                    onClick={() => handleGoTo(1)}
                    aria-label={nextPage ? t(`Navigate to ${nextPage}`, `Przejdź do ${nextPage}`) : ''}
                    tabIndex={isTablet ? -1 : 0}
                >
                    <CaretRightIcon />
                </button>
            </div>
        </div>
    );
});

export default Object.assign(LinkableTabs, {
    Link: TabLink,
});
