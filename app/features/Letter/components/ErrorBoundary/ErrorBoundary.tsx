import { isRouteErrorResponse, useRouteError } from '@remix-run/react';

import { Button } from '~/base/Button/Button';
import { component } from '~/utils/component';
import { useEffect } from 'react';
import { useTranslation } from '~/hooks/useTranslation';

export const LetterErrorBoundary = component('LetterErrorBoundary', function ({ className }) {
    const t = useTranslation();
    const error = useRouteError();

    useEffect(() => {
        if (isRouteErrorResponse(error)) {
            console.error(`${error.status}: `, error.data);
        } else {
            console.error(`Unknown error: `, error);
        }
    }, [error]);

    return (
        <div className={this.mcn(className)}>
            <p>
                {t(
                    "Something went wrong and we couldn't download a cover letter. Please try refreshing the page or come back later.",
                    'Coś poszło nie tak i nie byliśmy w stanie pobrać listu motywacyjnego. Spróbuj odświeżyć stronę lub wróć później.'
                )}
            </p>
            <Button
                className={this.__('Refresher')}
                onClick={() => window.location.reload()}
            >
                {t('Refresh', 'Odśwież')}
            </Button>
        </div>
    );
});
