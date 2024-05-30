import type { LinksFunction } from '@remix-run/node';
import Resume from '~/components/Resume/Resume';
import { component } from '~/utils/component';
import pageStyles from '../styles/cv.css';
import { useDebounce } from 'use-debounce';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pageStyles }];

export default component('CvPage', function() {
    const [companyName] = useDebounce('', 100);

    return (
        <Resume
            className={this.mcn()}
            companyName={companyName}
        />
    );
})
