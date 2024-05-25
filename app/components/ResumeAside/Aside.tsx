import { additionalSkillsData, hobbiesData } from '~/data/resume';

import A4 from '../A4/A4';
import Certificates from '../Certificates/Certificates';
import Contacts from '../Contacts/Contacts';
import type { PropsWithChildren } from 'react';
import { component } from '~/utils/component';
import { useData } from '~/hooks/useData';
import { useTranslation } from '~/hooks/useTranslation';

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

    const additionalSkills = useData(additionalSkillsData)
    const hobbies = useData(hobbiesData)

    return (
        <aside className={this.mcn(className)}>
            <A4.Aside>
                <div className={this.__('ImageWrapper')}>
                    <img
                        src='/images/profi-opt.jpg'
                        alt={t('my profile', 'moje zdjęcie profilowe')}
                        loading='eager'
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
                    <p className={ this.__('PrintNote') }>
                        { t(
                            "You might also visit: http://localhost:3000 to see the interactive version of my CV",
                            "Możecie Państwo także odwiedzić: http://localhost:3000, aby przejrzeć interaktywną wersję mojego CV"
                        ) }
                    </p>
                </div>
            </A4.Aside>
        </aside>
    );
});
