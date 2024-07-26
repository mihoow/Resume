import { LoaderFunctionArgs, redirect } from '@remix-run/node';

import { component } from '~/utils/component';
import { getUserSession } from '~/services/userSession';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const userSession = await getUserSession(request);

    if (!userSession.isAdmin) {
        throw redirect('..');
    }

    return null;
};

export default component('EditCoverLetter', function ({ className }) {
    return <div className={this.mcn(className)}>Hello</div>;
});
