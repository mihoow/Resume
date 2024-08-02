import { additionalSkillsData, hobbiesData } from '~/features/Resume/data';

import A4 from '../../../../components/A4/A4';
import Certificates from '../Certificates/Certificates';
import Contacts from '../Contacts/Contacts';
import { type PropsWithChildren } from 'react';
import { component } from '~/utils/component';
import { useData } from '~/hooks/useData';
import { useTranslation } from '~/hooks/useTranslation';
import { useRootData } from '~/hooks/useRootData';
import { DEFAULT_LOCALE, Page, WEBSITE_URL } from '~/config';
import { useLocale } from '~/hooks/useLocale';

const AsideListLayout = component<PropsWithChildren<{ title: string }>>(
    'AsideListLayout',
    function ({ className, title, children }) {
        return (
            <div className={this.mcn(className)}>
                <h4 className={this.__('Title')}>{title}</h4>
                {children}
            </div>
        );
    }
);

const AsideList = component<{
    title: string;
    items: string[];
}>('AsideList', function ({ className, title, items }) {
    return (
        <AsideListLayout
            title={title}
            className={this.mcn(className)}
        >
            <ul className={this.__('List')}>
                {items.map((text, i) => (
                    <li
                        key={i}
                        className={this.__('Item')}
                    >
                        {text}
                    </li>
                ))}
            </ul>
        </AsideListLayout>
    );
});

export default component('Aside', function ({ className }) {
    const t = useTranslation();
    const locale = useLocale();

    const additionalSkills = useData(additionalSkillsData);
    const hobbies = useData(hobbiesData);
    const company = useRootData(({ company }) => company);

    const token = company?.token;
    const websiteURL = token
        ? `${WEBSITE_URL}${locale === DEFAULT_LOCALE ? '' : `/${locale}`}${Page.RESUME}?token=${token}`
        : null;

    return (
        <aside className={this.mcn(className)}>
            <A4.Aside>
                <div className={this.__('ImageWrapper')}>
                    <img
                        src='/images/profi-opt.jpg'
                        alt={t('my profile', 'moje zdjęcie profilowe')}
                        loading='eager'
                        width={226.5}
                        height={339}
                    />
                </div>
                <div className={this.__('Content')}>
                    <Contacts className={this.__('Contacts')} />
                    <AsideListLayout title={t('Some certificates', 'Wybrane certyfikaty')}>
                        <Certificates />
                    </AsideListLayout>
                </div>
            </A4.Aside>
            <A4.Aside>
                <div className={this.__('Content')}>
                    <AsideList
                        title={t('Additional skills', 'Dodatkowe umiejętności')}
                        items={additionalSkills}
                    />
                    <AsideList
                        title={t('Interests', 'Zainteresowania')}
                        items={hobbies}
                    />
                    {websiteURL && (
                        <p className={this.__('PrintNote')}>
                            {t(
                                `You might also visit: ${websiteURL} to see the interactive version of my CV`,
                                `Możecie Państwo także odwiedzić: ${websiteURL}, aby przejrzeć interaktywną wersję mojego CV`
                            )}
                        </p>
                    )}
                </div>
            </A4.Aside>
        </aside>
    );
});
