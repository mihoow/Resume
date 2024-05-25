import { component } from '~/utils/component';
import { type PropsWithChildren, Fragment } from 'react';
import { useTranslation } from '~/hooks/useTranslation';
import Link from '~/base/Link';
import Languages from '../Languages/Languages';
import Stack from '../Stack/Stack';
import A4 from '../A4/A4';
import type { Experience } from '~/types/resume';
import { useData } from '~/hooks/useData';
import { aboutMeData, scandiwebExperienceData } from '~/data/resume';

const SubsectionSubject = component<{
    subject: Experience['subject'];
}>('SubsectionSubject', function ({ className, subject }) {
    if (typeof subject === 'string') {
        return <span className={this.mcn(className)}>{subject}</span>;
    }

    const { name, link } = subject;

    return (
        <Link
            type='native'
            to={link}
            newTab
            className={this.mcn(className)}
        >
            {name}
        </Link>
    );
});

const SubsectionLabels = component<{
    labels: Exclude<Experience['labels'], undefined>;
}>('SubsectionLabels', function ({ className, labels }) {
    return (
        <ul className={this.mcn(className)}>
            {labels.map((label, i) => (
                <Fragment key={i}>
                    <li className={this.__('Label')}>{label}</li>
                </Fragment>
            ))}
        </ul>
    );
});

const Subsection = component<{
    data: Experience;
}>(
    'Subsection',
    function ({
        className,
        data: { startDate, endDate, title, subject, location, labels, description, listTitle, listItems },
    }) {
        return (
            <div className={this.mcn(className)}>
                <h3 className={this.__('Header')}>
                    {startDate} - {endDate} - <em className={this.__('Title')}>{title}</em>
                </h3>
                <span>
                    <SubsectionSubject subject={subject} />
                    {location && (
                        <>
                            {' | '}
                            <span className={this.__('Location')}>{location}</span>
                        </>
                    )}
                </span>
                {!!labels?.length && <SubsectionLabels labels={labels} />}
                {description && <p className={this.__('Description')}>{description}</p>}
                {listTitle && <em className={this.__('ListTitle')}>{listTitle}:</em>}
                {!!listItems?.length && (
                    <ul className={this.__('List')}>
                        {listItems.map((value, i) => {
                            if (typeof value === 'string') {
                                return (
                                    <li
                                        key={i}
                                        className={this.__('Item')}
                                    >
                                        {value}
                                    </li>
                                );
                            }

                            const { title, content } = value;

                            return (
                                <li
                                    key={i}
                                    className={this.__('Item')}
                                >
                                    <span className={this.__('ItemTitle')}>{title}: </span>
                                    <span className={this.__('ItemContent')}>{content};</span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        );
    }
);

const Section = component<
    PropsWithChildren<{
        className?: string;
        title: string;
    }>
>('Section', function ({ className, title, children }) {
    return (
        <section className={this.mcn(className)}>
            <h2 className={this.__('Title')}>{title}</h2>
            {children}
        </section>
    );
});

export default component<{
    className?: string;
    companyName: string;
    isAdmin: boolean;
}>('Main', function ({ className, companyName }) {
    const t = useTranslation();

    const aboutMe = useData(aboutMeData);
    const scandiwebExperience = useData(scandiwebExperienceData);

    return (
        <div className={this.mcn(className)}>
            <A4.Main companyName={companyName}>
                <header className={this.__('Header')}>
                    <h1 className={this.__('NameSurname')}>
                        <span className={this.__('Name')}>Michał</span>
                        <span className={this.__('Surname')}>Wieczorek</span>
                    </h1>
                    <em className={this.__('Position')}>{t('Web developer')}</em>
                    <p className={this.__('AboutMe')}>{aboutMe}</p>
                </header>
                <div className={this.__('Categories')}>
                    <Section title={t('Experience', 'Doświadczenie')}>
                        <Subsection data={scandiwebExperience} />
                    </Section>
                </div>
            </A4.Main>
            <A4.Main companyName={companyName}>
                <div className={this.__('Categories')}>
                    <Section title={t('Languages', 'Języki')}>
                        <Languages />
                    </Section>
                    <Section title={t('My Stack', 'Moje narzędzia')}>
                        <Stack />
                    </Section>
                </div>
            </A4.Main>
        </div>
    );
});
