import type { ComponentPropsWithoutRef } from 'react';
import { Fragment } from 'react';
import { component } from '~/utils/component';

type Props = {
    count?: number;
};

export const Skeleton = component<Props & Omit<ComponentPropsWithoutRef<'span'>, keyof Props>>(
    'Skeleton',
    function ({ className, count = 1, ...props }) {
        const totalLines = Math.ceil(count);
        const fraction = totalLines - count;

        return (
            <span
                className={this.mcn(className)}
                aria-live='polite'
                aria-busy
                {...props}
            >
                {Array.from({ length: totalLines }, (_, i) => {
                    const isLastEl = i === totalLines - 1
                    const width = isLastEl && fraction > 0 ? `${fraction * 100}%` : '100%';

                    return (
                        <Fragment key={i}>
                            <span
                                className={this.__('Line')}
                                style={{ width }}
                            >
                                &zwnj;
                            </span>
                            <br />
                        </Fragment>
                    );
                })}
            </span>
        );
    }
);
