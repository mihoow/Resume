import { LinksFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { component } from '~/utils/component';
import layoutStyles from '@samples/styles/root.css?url';

export const handle = {
    appLayout: 'wide'
}

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: layoutStyles }];

export default component('SamplesLayout', function () {
    return (
        <div className={this.mcn()}>
            <Outlet />
        </div>
    );
});
