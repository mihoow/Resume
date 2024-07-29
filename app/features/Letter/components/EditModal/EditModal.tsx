import { useCallback, useMemo, useRef, useState } from 'react';
import { useFetcher, useNavigate, useSearchParams } from '@remix-run/react';

import { EditHeadersStep } from '../EditHeadersStep/EditHeadersStep';
import { EditTextFormData } from '../../type';
import { EditTextStep } from '../EditTextStep/EditTextStep';
import Modal from '~/base/Modal';
import type { ModalHandle } from '~/types/global';
import { ModalHeader } from '~/base/Modal/ModalHeader';
import { component } from '~/utils/component';
import { noopFn } from '~/utils/misc';

export const EditModal = component('EditModal', function ({ className }) {
    const accumulatedFormData = useRef<Record<string, string | null>>({});
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);

    const fetcher = useFetcher();
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

    const handleFirstStepSubmit = useCallback((data: Record<string, string>) => {
        accumulatedFormData.current = {
            ...accumulatedFormData.current,
            ...data,
        };

        setCurrentStep(2);
    }, []);

    const handleGoBack = useCallback(() => {
        setCurrentStep(1)
    }, [])

    const handleLastStepSubmit = useCallback((data: EditTextFormData) => {
        accumulatedFormData.current = {
            ...accumulatedFormData.current,
            ...data,
        };

        fetcher.submit(accumulatedFormData.current, {
            method: 'POST',
            preventScrollReset: true,
            encType: 'application/json',
        });
    }, [fetcher]);

    return (
        <Modal
            onClose={handleClose}
            className={this.mcn(className)}
        >
            <ModalHeader>
                <span>Edit cover letter</span>
            </ModalHeader>
            {currentStep === 1 && <EditHeadersStep onSubmit={handleFirstStepSubmit} />}
            {currentStep === 2 && (
                <EditTextStep
                    handle={modalHandle}
                    onPrev={handleGoBack}
                    onSubmit={handleLastStepSubmit}
                />
            )}
        </Modal>
    );
});
