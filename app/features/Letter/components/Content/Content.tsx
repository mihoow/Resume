import { PropsWithChildren } from 'react';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

export const LetterContent = component<PropsWithChildren>('LetterContent', function ({ className, children }) {
    const t = useTranslation();

    return (
        <div className={this.mcn(className)}>
            <header className={this.__('Header')}>
                <div className={this.__('Recipient')}>
                    <span className={this.__('To')}>{t('To', 'Do')}</span>
                    <span>James Alex Smith</span>
                    <span>HR Manager</span>
                    <span>Cloud Clearwater</span>
                    <span>4292 Sugarfoot Lane, Raleigh</span>
                    <span>North Dakota, U.S.</span>
                </div>
                <time
                    dateTime='2024-06-24'
                    className={this.__('Date')}
                >
                    24 June, 2024
                </time>
            </header>
            <strong className={this.__('Greeting')}>Dear Mr. Smith,</strong>
            <article className={this.__('Content')}>{children}</article>
            <footer className={this.__('Farewell')}>
                <span>{t('Sincerely', 'Z poważaniem')},</span>
                <span>Michał Wieczorek</span>
            </footer>
        </div>
    );
});
