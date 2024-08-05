import { LinksFunction, LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getCompanyCodeFromUrl, getCoverLetter } from '@letter/services/coverLetter.server';

import { CoverLetter } from '@letter/components/CoverLetter/CoverLetter';
import { DEFAULT_LOCALE } from '~/config';
import { LetterErrorBoundary } from '@letter/components/ErrorBoundary/ErrorBoundary';
import { Locale } from '~/types/global';
import { component } from '~/utils/component';
import { getFixedTFromPathname } from '~/utils/internationalization';
import pageStyles from '~/styles/pages/cover-letter.css?url';
import { useMemoized } from '~/hooks/useMemoized';

export const loader = async ({ request: { url }, params: { lang = DEFAULT_LOCALE } }: LoaderFunctionArgs) => {
    const companyCode = getCompanyCodeFromUrl(url);
    const coverLetter = await getCoverLetter(companyCode, lang as Locale);

    if (!coverLetter) {
        throw new Response('No cover letter was found', { status: 404 });
    }

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
    const { coverLetter: nextCoverLetter } = useLoaderData<typeof loader>();
    const coverLetter = useMemoized(
        nextCoverLetter,
        ({ updatedAt: currUpdatedAt, language: currLanguage }, { updatedAt: nextUpdatedAt, language: nextLanguage }) =>
            currUpdatedAt === nextUpdatedAt && currLanguage === nextLanguage
    );

    const { html } = coverLetter;

    return (
        <>
            <CoverLetter
                data={coverLetter}
                html={html}
            />
            <Outlet context={coverLetter} />
        </>
    );
});

export const ErrorBoundary = LetterErrorBoundary;
