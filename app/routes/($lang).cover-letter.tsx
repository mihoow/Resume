import { LinksFunction, LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node';
import { getCompanyCodeFromUrl, getCoverLetter } from '@letter/service.server';

import { CoverLetter } from '@letter/components/CoverLetter';
import { DEFAULT_LOCALE } from '~/config';
import { Locale } from '~/types/global';
import { component } from '~/utils/component';
import { getFixedTFromPathname } from '~/utils/internationalization';
import pageStyles from '../styles/cover-letter.css?url';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request: { url }, params: { lang = DEFAULT_LOCALE } }: LoaderFunctionArgs) => {
    const companyCode = getCompanyCodeFromUrl(url);
    const coverLetter = await getCoverLetter(companyCode, lang as Locale);

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

    console.log('>>letter', coverLetter);

    return <CoverLetter />;
});
