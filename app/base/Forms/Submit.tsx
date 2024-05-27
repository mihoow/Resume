import { Button, type ButtonProps } from '../Button/Button';
import { component } from '~/utils/component';
import { useContextSelector } from 'use-context-selector';
import { FormContext } from './Form.context';
import { useEffect, useRef, useState } from 'react';

export const Submit = component<Omit<ButtonProps, 'isLoading' | 'type'>, HTMLButtonElement>(
    'Submit',
    function ({ className, disabled, myRef, children, ...props }) {
        const timeoutRef = useRef<NodeJS.Timeout>();
        const isSubmitting = useContextSelector(FormContext, ({ isSubmitting }) => isSubmitting)

        const [isLoading, setIsLoading] = useState(isSubmitting)
        const isDisabled = isLoading || disabled;

        useEffect(() => {
            if (isSubmitting && !isLoading) {
                setIsLoading(true)
            } else if (isLoading && !isSubmitting) {
                // ensure the button is in the loading state for at least 0.5 sec
                timeoutRef.current = setTimeout(() => {
                    setIsLoading(false)
                }, 500)
            }

            return () => clearTimeout(timeoutRef.current)
        }, [isLoading, isSubmitting])


        return (
            <Button
                myRef={myRef}
                className={this.mcn(className)}
                type='submit'
                isLoading={isLoading}
                disabled={isDisabled}
                {...props}
            >
                {children}
            </Button>
        );
    }
);
