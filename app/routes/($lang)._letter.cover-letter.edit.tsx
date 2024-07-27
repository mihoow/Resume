import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useNavigate, useSearchParams } from '@remix-run/react';

import { ActionType } from '~/config';
import EditorModal from '~/features/RichTextEditor/components/EditorModal/EditorModal';
import { ModalHandle } from '~/types/global';
import { component } from '~/utils/component';
import { getUserSession } from '~/services/userSession';
import { useMemo } from 'react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const userSession = await getUserSession(request);

    if (!userSession.isAdmin) {
        throw redirect('..');
    }

    return null;
};

export default component('EditCoverLetter', function () {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const modalHandle: ModalHandle = useMemo(
        () => ({
            isOpen: true,
            open: () => {},
            close: () => navigate({ pathname: '..', search: searchParams.toString() }, { preventScrollReset: true }),
        }),
        [searchParams]
    );

    return (
        <EditorModal
            intent={ActionType.ADMIN_AUTH}
            handle={modalHandle}
        >
            <EditorModal.Header title='Edit cover letter' />
            <EditorModal.Body />
        </EditorModal>
    );
});
