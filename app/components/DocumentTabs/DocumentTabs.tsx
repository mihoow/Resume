import LinkableTabs from '~/base/LinkableTabs/LinkableTabs';
import { Page } from '~/config';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

export const DocumentTabs = component('DocumentTabs', function ({ className }) {
    const t = useTranslation();

    return (
        <LinkableTabs className={this.mcn(className)}>
            <LinkableTabs.Link page={Page.RESUME}>{t('Resume', 'Życiorys')}</LinkableTabs.Link>
            <LinkableTabs.Link page={Page.COVER_LETTER}>{t('Cover letter', 'List przewodni')}</LinkableTabs.Link>
            <LinkableTabs.Link page={Page.ABOUT_ME}>{t('About me', 'O mnie')}</LinkableTabs.Link>
        </LinkableTabs>
    );
});
