import { useMemo, type ComponentPropsWithoutRef } from 'react';
import { Form as RemixForm, useNavigation } from '@remix-run/react';
import { component } from '~/utils/component';
import type { FormContextType } from './Form.context';
import { FormContext } from './Form.context';

type Props = {
    intent: string;
} & ComponentPropsWithoutRef<typeof RemixForm>;

export const Form = component<Props, HTMLFormElement>(
    'Form',
    function ({ className, intent, children, myRef, ...props }) {
        const { formData, state } = useNavigation();

        const isSubmitting = state === 'submitting' && formData?.get('intent') === intent;
        const memoizedValue: FormContextType = useMemo(() => ({ intent, isSubmitting }), [intent, isSubmitting]);

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
