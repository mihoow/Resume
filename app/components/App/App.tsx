import { useMemo, type PropsWithChildren } from 'react';
import { component } from '~/utils/component';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { useMatches } from '@remix-run/react';
import { AppLayout, RouteHandle } from '~/types/global';

export const App = component<PropsWithChildren>('App', function ({ children }) {
    const matches = useMatches();

    const appLayout = useMemo(() => {
        return matches.reduce<AppLayout>((resultLayout, { handle }) => {
            if (!handle) return resultLayout;

            const { appLayout } = handle as RouteHandle;

            return appLayout || resultLayout;
        }, 'a4');
    }, [matches]);

    const isWide = appLayout === 'wide';

    return (
        <div className={this.__({ isWide })}>
            <Header
                isWide={isWide}
                className={this.__('Header')}
            />
            {children}
            <Footer
                isWide={isWide}
                className={this.__('Footer')}
            />
        </div>
    );
});
