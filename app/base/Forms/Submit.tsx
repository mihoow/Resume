import { Button, type ButtonProps } from '../Button/Button';
import { component } from '~/utils/component';
import { useContextSelector } from 'use-context-selector';
import { FormContext } from './Form.context';

export const Submit = component<Omit<ButtonProps, 'isLoading' | 'type'>, HTMLButtonElement>(
    'Submit',
    function ({ className, disabled, myRef, children, ...props }) {
        const isSubmitting = useContextSelector(FormContext, ({ isSubmitting }) => isSubmitting)
        const isDisabled = isSubmitting || disabled;

        return (
            <Button
                myRef={myRef}
                className={this.mcn(className)}
                type='submit'
                isLoading={isSubmitting}
                disabled={isDisabled}
                {...props}
            >
                {children}
            </Button>
        );
    }
);
