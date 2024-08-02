import { TEMPLATE_LANGUAGE_QUERY_PARAM, TEMPLATE_QUERY_PARAM } from '~/features/Letter/config';
import { useNavigate, useSearchParams } from '@remix-run/react';

import { ActionType } from '~/config';
import Modal from '~/base/Modal/Modal';
import { ToastsListContext } from '~/base/Toast/ToastList.context';
import { component } from '~/utils/component';
import { useCallback } from 'react';
import { useContext } from 'use-context-selector';

export default component('EditCoverLetter', function () {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { clearFailureMessages } = useContext(ToastsListContext);

    const handleNavigateBack = useCallback(() => {
        clearFailureMessages(ActionType.EDIT_COVER_LETTER);

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(TEMPLATE_QUERY_PARAM);
        newSearchParams.delete(TEMPLATE_LANGUAGE_QUERY_PARAM);

        navigate({ pathname: '..', search: newSearchParams.toString() }, { preventScrollReset: true });
    }, [clearFailureMessages, searchParams]);

    return (
        <Modal
            dismissible={false}
            onClose={handleNavigateBack}
        >
            <Modal.Header>Edit about me</Modal.Header>
            <Modal.Body>Hello</Modal.Body>
        </Modal>
    );
});
