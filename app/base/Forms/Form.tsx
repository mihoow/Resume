import { useMemo, type ComponentPropsWithoutRef, useEffect, useState } from 'react';
import { Form as RemixForm, useActionData, useNavigation } from '@remix-run/react';
import { component } from '~/utils/component';
import type { FormContextType } from './Form.context';
import { FormContext } from './Form.context';
import { isActionData, isValidationErrorData } from '~/utils/misc';
import { useContextSelector } from 'use-context-selector';
import { ToastsListContext } from '../Toast/ToastList.context';
import { useMirrorRef } from '~/hooks/useMirrorRef';
import type { ValidationErrorData } from '~/types/global';

type Props = {
    intent: string;
    onSuccess?: VoidFunction;
    onFailure?: VoidFunction;
} & ComponentPropsWithoutRef<typeof RemixForm>;

export const Form = component<Props, HTMLFormElement>(
    'Form',
    function ({ className, intent, onSuccess, onFailure, children, myRef, ...props }) {
        const { formData, state } = useNavigation();
        const actionData = useActionData();
        const clearFailureMessages = useContextSelector(
            ToastsListContext,
            ({ clearFailureMessages }) => clearFailureMessages
        );

        const [validationErrors, setValidationErrors] = useState<ValidationErrorData['validationErrors'] | null>(null);

        const isSubmitting = state === 'submitting' && formData?.get('intent') === intent;
        const memoizedValue: FormContextType = useMemo(
            () => ({ intent, isSubmitting, validationErrors: validationErrors || {} }),
            [intent, isSubmitting, validationErrors]
        );

        const effectsArgs = useMirrorRef({
            intent,
            onSuccess,
            onFailure,
            clearFailureMessages,
        });

        useEffect(() => {
            if (!isValidationErrorData(actionData, intent)) return;

            setValidationErrors(actionData.validationErrors);
        }, [actionData, intent]);

        useEffect(() => {
            const { intent, onSuccess, onFailure } = effectsArgs.current;

            if (!isActionData(actionData, intent) || state !== 'idle') return;

            const { ok } = actionData;

            if (ok) {
                onSuccess?.();
            } else {
                onFailure?.();
            }
        }, [actionData, state, effectsArgs]);

        useEffect(
            () => () => {
                const { intent, clearFailureMessages } = effectsArgs.current;

                clearFailureMessages(intent);
            },
            [effectsArgs]
        );

        return (
            <FormContext.Provider value={memoizedValue}>
                <RemixForm
                    ref={myRef}
                    className={this.mcn(className)}
                    {...props}
                >
                    <input
                        type='hidden'
                        name='intent'
                        value={intent}
                    />
                    {children}
                </RemixForm>
            </FormContext.Provider>
        );
    }
);
