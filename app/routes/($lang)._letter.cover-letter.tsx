import { LinksFunction, LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getCompanyCodeFromUrl, getCoverLetter } from '@letter/service.server';

import { DEFAULT_LOCALE } from '~/config';
import { LetterContent } from '@letter/components/Content/Content';
import { LetterErrorBoundary } from '~/features/Letter/components/ErrorBoundary/ErrorBoundary';
import { Locale } from '~/types/global';
import { component } from '~/utils/component';
import { getFixedTFromPathname } from '~/utils/internationalization';
import pageStyles from '~/styles/pages/cover-letter.css?url';

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
    const { coverLetter } = useLoaderData<typeof loader>();

    console.log('>>letter', coverLetter);

    return (
        <>
            <LetterContent>
                <p>
                    My name is Chuck Ferris, and I'm writing to apply for the accountant position with Brick Book
                    Accounting. As a recent graduate of Stone University, I'm ready to apply the accounting and
                    financial training I gained while earning my bachelor's degree to optimize the organization's
                    bookkeeping and reporting process. I've always loved numbers, and I'm enthusiastic about the chance
                    to work with the senior accountants and financial professionals at Brick Book Accounting.
                </p>
                <p>
                    I believe my practical experience in accounting software, business and organization makes me an
                    ideal candidate for this position. Along with my proficiency in programs like QuickBooks and Xero,
                    my computer skills and penchant for learning quickly would help me in mastering Brick Book
                    Accounting's internal and external applications right away. In my time as an assistant bookkeeper, I
                    learned the importance of paying close attention to detail and was able to increase documentation
                    accuracy by 5%. This position aligns perfectly with my career aspiration of developing my accounting
                    skills even further and eventually becoming a senior accountant.
                </p>
                <p>
                    One thing that captured my attention about Brick Book Accounting is its emphasis on helping small
                    businesses. I love that its accounting services are simple and affordable, especially for small
                    firms that need assistance with tax documents. From my experience as a volunteer economics tutor, I
                    gained a passion for helping people in need. I would be honored to contribute to the organization's
                    mission of supporting community businesses and helping local economies thrive. As an employee, I
                    would dedicate myself to serving clients and making sure everyone can reach their financial goals.
                </p>
                <p>
                    I'm currently working on becoming a Certified Public Accountant. I'm confident that this
                    certification and my experience have prepared me to join the team at Brick Book Accounting. I'm
                    looking forward to meeting you in person to further discuss my qualifications for the role. Please
                    don't hesitate to contact me if you have any questions, and thank you for your time and
                    consideration.
                </p>
            </LetterContent>
            <Outlet />
        </>
    );
});

export const ErrorBoundary = LetterErrorBoundary;
