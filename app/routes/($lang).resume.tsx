import type { LinksFunction, MetaFunction } from '@remix-run/node';

import Resume from '~/features/Resume/components/Resume/Resume';
import { component } from '~/utils/component';
import { getFixedTFromPathname } from '~/utils/internationalization';
import pageStyles from '../styles/cv.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pageStyles }];

export const meta: MetaFunction = ({ location: { pathname } }) => {
    const t = getFixedTFromPathname(pathname)

    return [
        { title: `Wieczorek | ${t('Resume', 'Życiorys')}` },
    ]
}

export default component('CvPage', function () {
    return <Resume className={this.mcn()} />;
});
