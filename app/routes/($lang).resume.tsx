import type { LinksFunction } from '@remix-run/node';
import Resume from '~/features/Resume/components/Resume/Resume';
import { component } from '~/utils/component';
import pageStyles from '../styles/cv.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pageStyles }];

export default component('CvPage', function () {
    return <Resume className={this.mcn()} />;
});
