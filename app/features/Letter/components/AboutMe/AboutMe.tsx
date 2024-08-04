import Letter from '../Letter/Letter';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

export const AboutMe = component<{ html: string }>('AboutMe', function ({ className, html }) {
    const t = useTranslation();

    return (
        <Letter className={this.mcn(className)}>
            <Letter.Greeting>{t('Dear Reader,', 'Szanowny Czytelniku,')}</Letter.Greeting>
            <Letter.Content html={html} />
            <Letter.Farewell />
        </Letter>
    );
});
