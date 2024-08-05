import { LetterLayout } from '@letter/components/Layout/Layout';
import { LinksFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { component } from '~/utils/component';
import layoutStyles from '~/styles/pages/letter-layout.css?url';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: layoutStyles }
]

export default component('LetterLayout', function () {
    return (
        <LetterLayout>
            <Outlet />
        </LetterLayout>
    );
});
