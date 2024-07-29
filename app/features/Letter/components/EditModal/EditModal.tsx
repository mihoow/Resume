import { CoverLetterDocument, CoverLetterTemplate, EditTextFormData } from '../../type';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useFetcher, useNavigate, useSearchParams } from '@remix-run/react';

import { EditHeadersStep } from '../EditHeadersStep/EditHeadersStep';
import { EditTextStep } from '../EditTextStep/EditTextStep';
import Modal from '~/base/Modal';
import type { ModalHandle } from '~/types/global';
import { ModalHeader } from '~/base/Modal/ModalHeader';
import { component } from '~/utils/component';
import { noopFn } from '~/utils/misc';
import { useRootData } from '~/hooks/useRootData';

export const EditModal = component<{ data: CoverLetterTemplate | CoverLetterDocument }>(
    'EditModal',
    function ({ className, data }) {
        const companyCode = useRootData(({ company }) => company?.code);

        const accumulatedFormData = useRef<Record<string, string | null>>({});
        const [currentStep, setCurrentStep] = useState<1 | 2>(() => (companyCode ? 1 : 2));

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
            setCurrentStep(1);
        }, []);

        const handleLastStepSubmit = useCallback(
            (data: EditTextFormData) => {
                accumulatedFormData.current = {
                    ...accumulatedFormData.current,
                    ...data,
                };

                fetcher.submit(accumulatedFormData.current, {
                    method: 'POST',
                    preventScrollReset: true,
                    encType: 'application/json',
                });
            },
            [fetcher]
        );

        const { language, html } = data;

        return (
            <Modal
                onClose={handleClose}
                className={this.mcn(className)}
            >
                <ModalHeader>
                    <span>Edit cover letter</span>
                </ModalHeader>
                {currentStep === 1 && (
                    <EditHeadersStep
                        data={data}
                        onSubmit={handleFirstStepSubmit}
                    />
                )}
                {currentStep === 2 && (
                    <EditTextStep
                        initialHTML={html}
                        handle={modalHandle}
                        language={language}
                        onPrev={companyCode ? handleGoBack : null}
                        onSubmit={handleLastStepSubmit}
                    />
                )}
            </Modal>
        );
    }
);
