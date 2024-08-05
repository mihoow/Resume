import { Outlet } from '@remix-run/react';
import { component } from '~/utils/component';

export default component('SamplesLayout', function () {
    return <Outlet />;
});
