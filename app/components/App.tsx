import MediaProvider from '~/base/Media/Media.provider';
import type { PropsWithChildren } from 'react';
import { ToastListProvider } from '~/base/Toast/ToastList.provider';
import { component } from '~/utils/component';

export const App = component<PropsWithChildren>('App', function ({ children }) {
    return (
        <MediaProvider>
            <ToastListProvider>
                {children}
            </ToastListProvider>
        </MediaProvider>
    );
});
