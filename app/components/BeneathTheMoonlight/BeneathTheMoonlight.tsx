import { Fragment, ReactNode } from 'react';

import { component } from '~/utils/component';

export const BeneathTheMoonlight = component('BeneathTheMoonlight', function ({ className }) {
    const repeat = (times: number, callback: () => ReactNode) => {
        return Array.from({ length: times }, (_, i) => <Fragment key={i}>{callback()}</Fragment>);
    };

    return (
        <div className={this.mcn(className)}>
            <div className={this.__('Hills')}>
                {repeat(3, () => (
                    <div className={this.__('Hill')} />
                ))}
            </div>
            <div className={this.__('Moons')}>
                {repeat(8, () => (
                    <div className={this.__('Moon')} />
                ))}
            </div>
            {repeat(4, () => (
                <div className={this.__('Shoot')} />
            ))}
            <div className={this.__('Stars')}>
                {repeat(200, () => (
                    <div className={this.__('Star')} />
                ))}
            </div>
        </div>
    );
});
