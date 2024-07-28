import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from '@remix-run/react';

import { EditHeadersStep } from '../EditHeadersStep/EditHeadersStep';
import { EditTextStep } from '../EditTextStep/EditTextStep';
import Modal from '~/base/Modal';
import type { ModalHandle } from '~/types/global';
import { ModalHeader } from '~/base/Modal/ModalHeader';
import { component } from '~/utils/component';
import { noopFn } from '~/utils/misc';

export const EditModal = component('EditModal', function ({ className }) {
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleClose = useCallback(
        () => navigate({ pathname: '..', search: searchParams.toString() }, { preventScrollReset: true }),
        [searchParams]
    );

    const modalHandle: ModalHandle = useMemo(
        () => ({
            isOpen: true,
            open: noopFn,
            close: handleClose,
        }),
        [handleClose]
    );

    return (
        <Modal
            onClose={handleClose}
            className={this.mcn(className)}
        >
            <ModalHeader>
                <span>Edit cover letter</span>
            </ModalHeader>
            {currentStep === 1 && <EditHeadersStep onSubmit={() => setCurrentStep(2)} />}
            {currentStep === 2 && (
                <EditTextStep
                    handle={modalHandle}
                    onPrev={() => setCurrentStep(1)}
                    onSubmit={() => {}}
                />
            )}
        </Modal>
    );
});
