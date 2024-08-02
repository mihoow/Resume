import { LinksFunction, MetaFunction } from '@remix-run/node';

import { LetterErrorBoundary } from '~/features/Letter/components/ErrorBoundary/ErrorBoundary';
import { Outlet } from '@remix-run/react';
import { component } from '~/utils/component';
import { getFixedTFromPathname } from '~/utils/internationalization';
import pageStyles from '~/styles/pages/about-me.css?url';

export const loader = async () => {
    throw new Response('No cover letter was found', { status: 404 });
};

export const meta: MetaFunction = ({ location: { pathname } }) => {
    const t = getFixedTFromPathname(pathname);

    return [{ title: `Wieczorek | ${t('About me', 'O mnie')}` }];
};

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pageStyles }];

export default component('CoverLetterPage', function () {
    return <Outlet />;
});

export const ErrorBoundary = LetterErrorBoundary;
