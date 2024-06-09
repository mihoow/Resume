import type { ComponentPropsWithoutRef, FC } from 'react';

import { component } from '~/utils/component';

export type IconButtonProps = { icon: FC; isActive?: boolean } & ComponentPropsWithoutRef<'button'>

export const IconButton = component<IconButtonProps, HTMLButtonElement>(
    'IconButton',
    function ({ className, icon: Icon, isActive = false, myRef, ...props }) {
        return (
            <button
                ref={myRef}
                type="button"
                className={this.cn(this.__({ isActive }), className)}
                {...props}
            >
                <Icon />
            </button>
        );
    }
);
