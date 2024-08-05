import { type PropsWithChildren } from 'react';
import { component } from '~/utils/component';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';

export const App = component<PropsWithChildren>('App', function ({ children }) {
    return (
        <div className={this.mcn()}>
            <Header className={this.__('Header')} />
            {children}
            <Footer className={this.__('Footer')} />
        </div>
    );
});
