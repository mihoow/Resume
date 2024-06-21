import type { ComponentPropsWithoutRef, FormEvent } from 'react';
import { Form as RemixForm, useNavigation } from '@remix-run/react';
import { isActionData, isValidationErrorData } from '~/utils/misc';
import { useEffect, useMemo, useRef, useState } from 'react';

import { FormContext } from './Form.context';
import type { FormContextType } from './Form.context';
import { ToastsListContext } from '../Toast/ToastList.context';
import type { ValidationErrorData } from '~/types/global';
import { component } from '~/utils/component';
import { getServerMessages } from '~/data/serverMessages';
import { useContextSelector } from 'use-context-selector';
import { useData } from '~/hooks/useData';
import { useMirrorRef } from '~/hooks/useMirrorRef';
import { useMultiSourceActionData } from '~/hooks/useMultiSourceActionData';

type Props = {
    intent: string;
    onSuccess?: VoidFunction;
    onFailure?: VoidFunction;
    onContextChange?: (ctx: FormContextType) => void;
} & ComponentPropsWithoutRef<typeof RemixForm>;

export const Form = component<Props, HTMLFormElement>(
    'Form',
    function ({ className, intent, onSuccess, onFailure, onContextChange, children, onSubmit, myRef, ...props }) {
        const wasSubmittedRef = useRef(false);

        const { formData, state } = useNavigation();
        const actionData = useMultiSourceActionData();
        const clearFailureMessages = useContextSelector(
            ToastsListContext,
            ({ clearFailureMessages }) => clearFailureMessages
        );

        const [validationErrors, setValidationErrors] = useState<ValidationErrorData['validationErrors'] | null>(null);
        const serverMessages = useData(getServerMessages);

        const translatedValidationErrors = useMemo(() => {
            if (!validationErrors) return {};

            return Object.entries(validationErrors).reduce<Record<string, string>>((acc, [key, messageKey]) => {
                return {
                    ...acc,
                    [key]: serverMessages[messageKey],
                };
            }, {});
        }, [validationErrors, serverMessages]);

        const isSubmitting = state === 'submitting' && formData?.get('intent') === intent;
        const memoizedValue: FormContextType = useMemo(
            () => ({ intent, isSubmitting, validationErrors: translatedValidationErrors }),
            [intent, isSubmitting, translatedValidationErrors]
        );

        const effectsArgs = useMirrorRef({
            intent,
            onSuccess,
            onFailure,
            onContextChange,
            clearFailureMessages,
        });

        useEffect(() => {
            if (!isValidationErrorData(actionData, intent)) return;

            setValidationErrors(actionData.validationErrors);
        }, [actionData, intent]);

        useEffect(() => {
            if (!wasSubmittedRef.current) return;

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

        useEffect(() => {
            const { onContextChange } = effectsArgs.current;

            onContextChange?.(memoizedValue)
        }, [effectsArgs, memoizedValue])

        const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
            onSubmit?.(e)

            wasSubmittedRef.current = true;
        }

        return (
            <FormContext.Provider value={memoizedValue}>
                <RemixForm
                    ref={myRef}
                    className={this.mcn(className)}
                    onSubmit={handleSubmit}
                    action='/action'
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
