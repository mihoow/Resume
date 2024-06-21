import { ComponentPropsWithoutRef, ReactNode } from 'react';

import { InfoIcon } from '~/icons/Info';
import { component } from '~/utils/component';

type Props = {
    title: ReactNode;
    color?: 'info' | 'warning';
};

export const Alert = component<Props & Omit<ComponentPropsWithoutRef<'div'>, keyof Props>>(
    'Alert',
    function ({ className, title, color = 'info', myRef, children, ...props }) {
        return (
            <div
                className={this.cn(this.__([color]), className)}
                ref={myRef}
                role='alert'
                {...props}
            >
                <div className={this.__('Header')}>
                    <InfoIcon />
                    <div>{title}</div>
                </div>
                {children && <div className={this.__('Content')}>{children}</div>}
            </div>
        );
    }
);
