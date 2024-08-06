import { BeneathTheMoonlight } from '../BeneathTheMoonlight/BeneathTheMoonlight';
import { component } from '~/utils/component';
import { getAttributions } from '~/data/global';
import { useData } from '~/hooks/useData';
import { useTranslation } from '~/hooks/useTranslation';

export const Footer = component<{ isWide?: boolean; }>('Footer', function ({ className, isWide = false }) {
    const t = useTranslation();
    const attributions = useData(getAttributions);

    return (
        <footer className={this.mcn(className)}>
            <BeneathTheMoonlight />
            <div className={this.__('Content')}>
                <ul className={this.__('AttributionList', { isWide })}>
                    {attributions.map(({ text, link: { href, text: linkText } }) => (
                        <li
                            key={href}
                            className={this.__('AttributionItem')}
                        >
                            <span className={this.__('AttributionText')}>{text}</span>
                            <a
                                href={href}
                                target='_blank'
                                rel='noopener noreferrer'
                                className={this.__('AttributionLink')}
                            >
                                {linkText}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className={this.__('Ending')}>
                    <span>{t('Thank you for your time.', 'Dziękuję za poświęcony czas.')}</span>
                    <span>{t('Have a great day!', 'Życzę miłego dnia!')}</span>
                    <span>
                        {t('Created with', 'Stworzono z')} <span className={this.__('Heart')}>&hearts;</span>{' '}
                        {t('and', 'i')} &#x2615;
                    </span>
                </div>
            </div>
        </footer>
    );
});
