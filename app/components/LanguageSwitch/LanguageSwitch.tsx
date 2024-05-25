import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '~/config';
import { Link, useLocation } from '@remix-run/react';

import type { CSSProperties } from 'react';
import GreatBritainFlagIcon from '~/icons/GreatBritainFlag';
import PolishFlagIcon from '~/icons/PolishFlag';
import { component } from '~/utils/component';
import { isSupportedLocale } from '~/utils/internationalization';
import { useLocale } from '~/hooks/useLocale';

const LanguageSwitch = component('LanguageSwitch', function ({ className }) {
    const currentLocale = useLocale();
    const { pathname } = useLocation();

    const pathnameWithoutLocale = (() => {
        const pathnameSegments = pathname.split('/').filter((segment) => segment !== '');
        const [localeSegment] = pathnameSegments;

        if (isSupportedLocale(localeSegment)) {
            return pathnameSegments.slice(1).join('/');
        }

        return pathname;
    })();

    return (
        <div className={this.mcn(className)}>
            <div
                aria-hidden
                className={this.__('FlagSlider')}
            >
                <div
                    className={this.__('FlagSliderTrack')}
                    style={
                        {
                            '--active-lang-order': SUPPORTED_LOCALES.findIndex((lang) => lang === currentLocale),
                        } as CSSProperties
                    }
                >
                    <div className={this.__('Icon')}>
                        <GreatBritainFlagIcon className={this.__('Flag')} />
                    </div>
                    <div className={this.__('Icon')}>
                        <PolishFlagIcon className={this.__('Flag')} />
                    </div>
                </div>
            </div>
            <div className={this.__('Links')}>
                {SUPPORTED_LOCALES.map((lang) => (
                    <Link
                        key={lang}
                        to={{
                            pathname:
                                lang === DEFAULT_LOCALE
                                    ? pathnameWithoutLocale || '/'
                                    : `/${lang}${pathnameWithoutLocale}`,
                        }}
                        replace
                        preventScrollReset
                        className={this.__('Link', { isActive: lang === currentLocale })}
                    >
                        {lang.toUpperCase()}
                    </Link>
                ))}
            </div>
        </div>
    );
});

export default LanguageSwitch;
