import { StrictMode, startTransition } from 'react';

import { RemixBrowser } from '@remix-run/react';
import { hydrateRoot } from 'react-dom/client';

async function hydrate() {
    startTransition(() => {
        hydrateRoot(
            document,
            <StrictMode>
                <RemixBrowser />
            </StrictMode>
        );
    });
}

if (window.requestIdleCallback) {
    window.requestIdleCallback(hydrate);
} else {
    // Safari doesn't support requestIdleCallback
    window.setTimeout(hydrate, 1);
}
