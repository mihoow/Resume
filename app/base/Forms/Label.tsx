import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import { cloneElement, useId } from 'react';

import { component } from '~/utils/component';

type Props = {
    value: ReactNode;
    children: ReactElement;
} & Omit<ComponentPropsWithoutRef<'label'>, 'children'>;

export const Label = component<Props, HTMLDivElement>(
    'Label',
    function ({ className, value, children, myRef, htmlFor, ...props }) {
        const generatedId = useId()
        const id = htmlFor || generatedId;

        return (
            <div
                ref={myRef}
                className={this.mcn(className)}
            >
                <label
                    htmlFor={id}
                    className={this.__('Inner')}
                    {...props}
                >
                    {value}
                </label>
                {cloneElement(children, { ...children.props, id })}
            </div>
        );
    }
);
