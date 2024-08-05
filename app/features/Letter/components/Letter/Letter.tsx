import { ComponentPropsWithoutRef, PropsWithChildren } from 'react';

import { HTMLParser } from '~/base/HTMLParser/HTMLParser';
import type { Locale } from '~/types/global';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

const LetterGreeting = component<PropsWithChildren>('LetterGreeting', function ({ className, children }) {
    return <strong className={this.mcn(className)}>{children}</strong>;
});

const LetterContent = component<{ html: string }>('LetterContent', function ({ className, html }) {
    return (
        <article className={this.mcn(className)}>
            <HTMLParser content={html} />
        </article>
    );
});

const LetterFarewell = component<{ lang?: Locale }>('LetterFarewell', function ({ className, lang }) {
    const t = useTranslation(lang);

    return (
        <footer className={this.mcn(className)}>
            <span>{t('Sincerely', 'Z poważaniem')},</span>
            <span className={this.__('Signature')}>Michał Wieczorek</span>
        </footer>
    );
});

const Letter = component<PropsWithChildren<ComponentPropsWithoutRef<'div'>>>(
    'Letter',
    function ({ className, children, ...props }) {
        return (
            <div
                className={this.mcn(className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

export default Object.assign(Letter, {
    Greeting: LetterGreeting,
    Content: LetterContent,
    Farewell: LetterFarewell,
});
