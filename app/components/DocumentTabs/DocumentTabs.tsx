import LinkableTabs from '~/base/LinkableTabs/LinkableTabs';
import { Page } from '~/config';
import { component } from '~/utils/component';

export const DocumentTabs = component('DocumentTabs', function ({ className }) {
    return (
        <LinkableTabs className={this.mcn(className)}>
            <LinkableTabs.Link page={Page.RESUME}>Resume</LinkableTabs.Link>
            <LinkableTabs.Link page={Page.COVER_LETTER}>Cover letter</LinkableTabs.Link>
            <LinkableTabs.Link page={Page.ABOUT_ME}>About me</LinkableTabs.Link>
        </LinkableTabs>
    );
});
