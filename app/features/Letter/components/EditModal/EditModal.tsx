import type { CoverLetterDocument, CoverLetterTemplate, EditTextFormData, TemplatesByLanguage } from '../../type';
import { TEMPLATE_LANGUAGE_QUERY_PARAM, TEMPLATE_QUERY_PARAM } from '../../config';
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

export const EditModal = component<{
    data: CoverLetterTemplate | CoverLetterDocument;
    templates: TemplatesByLanguage;
    currentTemplate: CoverLetterTemplate | null;
}>('EditModal', function ({ className, data, templates, currentTemplate }) {
    const companyCode = useRootData(({ company }) => company?.code ?? null);

    const accumulatedFormData = useRef<Record<string, string | null>>({});
    const [currentStep, setCurrentStep] = useState<1 | 2>(() => (companyCode ? 1 : 2));

    const fetcher = useFetcher();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleClose = useCallback(() => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(TEMPLATE_QUERY_PARAM);
        newSearchParams.delete(TEMPLATE_LANGUAGE_QUERY_PARAM);

        navigate({ pathname: '..', search: newSearchParams.toString() }, { preventScrollReset: true });
    }, [searchParams]);

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

    const { language, html } = currentTemplate || data;

    return (
        <Modal
            onClose={handleClose}
            className={this.mcn(className)}
            contentClassName={this.__('ModalContent', { isSecondStep: currentStep === 2 })}
        >
            <ModalHeader>
                <span>Edit cover letter</span>
            </ModalHeader>
            {currentStep === 1 && companyCode && (
                <EditHeadersStep
                    companyCode={companyCode}
                    data={data}
                    onSubmit={handleFirstStepSubmit}
                />
            )}
            {currentStep === 2 && (
                <EditTextStep
                    companyCode={companyCode}
                    initialHTML={html}
                    handle={modalHandle}
                    language={language}
                    templates={templates}
                    onPrev={companyCode ? handleGoBack : null}
                    onSubmit={handleLastStepSubmit}
                />
            )}
        </Modal>
    );
});
