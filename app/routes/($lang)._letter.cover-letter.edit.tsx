import { LinksFunction, LoaderFunctionArgs, redirect } from '@remix-run/node';

import { EditModal } from '@letter/components/EditModal/EditModal';
import { component } from '~/utils/component';
import { getUserSession } from '~/services/userSession';
import pageStyles from '../styles/pages/letter-edit.css?url';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const userSession = await getUserSession(request);

    if (!userSession.isAdmin) {
        throw redirect('..');
    }

    return null;
};

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pageStyles }];

export default component('EditCoverLetter', function () {
    return <EditModal />;
});
