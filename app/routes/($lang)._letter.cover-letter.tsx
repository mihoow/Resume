import { LinksFunction, LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getCompanyCodeFromUrl, getCoverLetter } from '@letter/service.server';

import { DEFAULT_LOCALE } from '~/config';
import HTMLParser from '~/base/HTMLParser';
import { LetterContent } from '@letter/components/Content/Content';
import { LetterErrorBoundary } from '~/features/Letter/components/ErrorBoundary/ErrorBoundary';
import { Locale } from '~/types/global';
import { component } from '~/utils/component';
import { getFixedTFromPathname } from '~/utils/internationalization';
import pageStyles from '~/styles/pages/cover-letter.css?url';

export const loader = async ({ request: { url }, params: { lang = DEFAULT_LOCALE } }: LoaderFunctionArgs) => {
    const companyCode = getCompanyCodeFromUrl(url);
    const coverLetter = await getCoverLetter(companyCode, lang as Locale);

    // if (!coverLetter) {
    //     throw new Response('No cover letter was found', { status: 404 });
    // }

    return json({
        coverLetter,
    });
};

export const meta: MetaFunction = ({ location: { pathname } }) => {
    const t = getFixedTFromPathname(pathname);

    return [{ title: `Wieczorek | ${t('Cover letter', 'List motywacyjny')}` }];
};

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pageStyles }];

export default component('CoverLetterPage', function () {
    const { coverLetter } = useLoaderData<typeof loader>();

    if (!coverLetter) {
        // TODO: display a message
        return <Outlet />;
    }

    const { html } = coverLetter;

    return (
        <>
            <LetterContent data={coverLetter}>
                <HTMLParser content={html} />
            </LetterContent>
            <Outlet />
        </>
    );
});

export function ErrorBoundary() {
    return (
        <>
            <LetterErrorBoundary />
            <Outlet />
        </>
    );
}
