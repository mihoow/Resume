import type { ComponentPropsWithoutRef } from 'react';
import { component } from '~/utils/component';

const SelectWrapper = component<ComponentPropsWithoutRef<'select'>, HTMLSelectElement>(
    'Select',
    function ({ className, myRef, name, ...inputProps }) {
        return (
            <select
                ref={myRef}
                className={this.mcn(className)}
                name={name}
                {...inputProps}
            />
        );
    }
);

export const Select = Object.assign(SelectWrapper, {
    Option: component<ComponentPropsWithoutRef<'option'>, HTMLOptionElement>(
        'SelectOption',
        function ({ className, myRef, ...props }) {
            return (
                <option
                    className={this.mcn(className)}
                    ref={myRef}
                    {...props}
                />
            );
        }
    ),
});
