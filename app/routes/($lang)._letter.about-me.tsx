import { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Outlet, json, useLoaderData } from '@remix-run/react';
import { getFixedTFromPathname, isSupportedLocale } from '~/utils/internationalization';

import { AboutMe } from '@letter/components/AboutMe/AboutMe';
import { DEFAULT_LOCALE } from '~/config';
import { LetterErrorBoundary } from '@letter/components/ErrorBoundary/ErrorBoundary';
import { component } from '~/utils/component';
import { getAboutMeDocument } from '@letter/services/aboutMe.server';
import pageStyles from '~/styles/pages/about-me.css?url';

export const loader = async ({ params: { lang } }: LoaderFunctionArgs) => {
    const aboutMe = await getAboutMeDocument(isSupportedLocale(lang) ? lang : DEFAULT_LOCALE);

    if (!aboutMe) {
        throw new Response('The "About me" document was not found', { status: 404 });
    }

    return json({ aboutMe });
};

export const meta: MetaFunction = ({ location: { pathname } }) => {
    const t = getFixedTFromPathname(pathname);

    return [{ title: `Wieczorek | ${t('About me', 'O mnie')}` }];
};

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pageStyles }];

export default component('CoverLetterPage', function () {
    const { aboutMe } = useLoaderData<typeof loader>();

    return (
        <>
            <AboutMe html={aboutMe.html} />
            <Outlet context={aboutMe} />
        </>
    );
});

export const ErrorBoundary = LetterErrorBoundary;
