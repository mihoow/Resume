import { Document } from '~/components/Document/Document';
import { LinksFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { component } from '~/utils/component';
import layoutStyles from '~/styles/pages/doc.css?url';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: layoutStyles }];

export default component('DocumentLayout', function () {
    return (
        <Document>
            <Outlet />
        </Document>
    );
});
