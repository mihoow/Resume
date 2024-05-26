import type { CSSProperties } from 'react';
import { component } from '~/utils/component';

export const Spinner = component<{ size?: number }>('Spinner', function ({ className, size = 24 }) {
    return (
        <span
            className={this.mcn(className)}
            style={{ '--size': `${size}px` } as CSSProperties}
        />
    );
});
