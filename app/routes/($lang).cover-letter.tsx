import { LinksFunction, MetaFunction } from '@remix-run/node';

import { CoverLetter } from '@letter/components/CoverLetter';
import { component } from '~/utils/component';
import { getFixedTFromPathname } from '~/utils/internationalization';
import pageStyles from '../styles/cover-letter.css?url';

export const meta: MetaFunction = ({ location: { pathname } }) => {
    const t = getFixedTFromPathname(pathname);

    return [{ title: `Wieczorek | ${t('Cover letter', 'List motywacyjny')}` }];
};

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pageStyles }];

export default component('CoverLetterPage', function () {
    return <CoverLetter />;
});
