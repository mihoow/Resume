import { CSSProperties, useMemo } from 'react';
import type { CoverLetterDocument, CoverLetterTemplate } from '../../type';

import { IMAGE_SIZES } from '../../config';
import Letter from '../Letter/Letter';
import type { TFunction } from '~/types/global';
import { component } from '~/utils/component';
import { isLetterDocument } from '../../utils';
import { useTranslation } from '~/hooks/useTranslation';

function documentToRecipientLines(document: CoverLetterDocument | null) {
    const lines: string[] = [];

    if (!document) {
        return lines;
    }

    const {
        showRecipient,
        recipient: { names, surname, jobPosition },
        company: { name: companyName, addressLine1, addressLine2 },
        contacts: { phone, email },
    } = document;

    if (!showRecipient) return lines;

    if (names && surname) {
        lines.push(`${names} ${surname}`);
    }

    if (jobPosition) {
        lines.push(jobPosition);
    }

    if (companyName) {
        lines.push(companyName);

        if (addressLine1) {
            lines.push(addressLine1);

            if (addressLine2) {
                lines.push(addressLine2);
            }
        }
    }

    if (phone) {
        lines.push(phone);
    }

    if (email) {
        lines.push(email);
    }

    return lines;
}

function getDate(document: CoverLetterDocument | null) {
    if (!document) return null;

    const { date, language } = document;

    if (!date) return null;

    return {
        raw: date,
        formatted: new Intl.DateTimeFormat(language, { dateStyle: 'long' }).format(new Date(date)),
    };
}

function getGreeting(document: CoverLetterDocument | null, t: TFunction) {
    const surname = document?.recipient?.surname;
    const sex = document?.recipient?.sex;

    if (!surname || !sex) {
        return t('Dear Recruiter', 'Szanowni Państwo');
    }

    return t(
        `Dear ${sex === 'female' ? 'Ms.' : 'Mr.'} ${surname}`,
        `${sex === 'female' ? 'Szanowna Pani' : 'Szanowny Panie'} ${surname}`
    );
}

export const CoverLetter = component<{ data: CoverLetterTemplate | CoverLetterDocument; html: string; }>(
    'CoverLetter',
    function ({ className, data, html }) {
        const { language } = data;
        const t = useTranslation(language); // we use language set in cover-letter as it might be different from global locale

        const fullDocument = isLetterDocument(data) ? data : null;

        const { recipientLines, date, greeting } = useMemo(
            () => ({
                recipientLines: documentToRecipientLines(fullDocument),
                date: getDate(fullDocument),
                greeting: getGreeting(fullDocument, t),
            }),
            [fullDocument, t]
        );

        return (
            <Letter
                className={this.mcn(this.__({ hasRecipient: recipientLines.length > 0 }), className)}
                style={{ '--image-width': `${IMAGE_SIZES.width}px` } as CSSProperties}
            >
                {(recipientLines.length > 0 || date) && (
                    <header className={this.__('Header')}>
                        {recipientLines.length > 0 && (
                            <div className={this.__('Recipient')}>
                                <span className={this.__('To')}>{t('To', 'Do')}</span>
                                {recipientLines.map((line, i) => (
                                    <span key={i}>{line}</span>
                                ))}
                            </div>
                        )}
                        {date && (
                            <time
                                dateTime={date.raw}
                                className={this.__('Date')}
                            >
                                {date.formatted}
                            </time>
                        )}
                    </header>
                )}
                <Letter.Greeting className={this.__('Greeting')}>{greeting},</Letter.Greeting>
                <Letter.Content html={html} className={this.__('Content')} />
                <Letter.Farewell lang={language} />
            </Letter>
        );
    }
);
