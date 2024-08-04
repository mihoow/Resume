import { TypedResponse, json } from '@remix-run/node';

import { ABOUT_ME_IDENTIFIER } from '../config';
import type { Locale } from '~/types/global';
import type { ToastData } from '~/base/Toast/Toast.type';
import { connectToDatabase } from '~/services/db.server';
import type { AboutMeDocument } from '../type';

async function getGlobalsCollection() {
    const db = await connectToDatabase();
    return db.db('resume').collection('globals');
}

export async function getAboutMeDocument(language: Locale) {
    const globals = await getGlobalsCollection();

    return globals.findOne<AboutMeDocument>({ identifier: ABOUT_ME_IDENTIFIER, language });
}

export async function saveAboutMeDocument(request: Request, language: Locale): Promise<TypedResponse<ToastData>> {
    try {
        const [formData, globals] = await Promise.all([request.formData(), getGlobalsCollection()]);
        const content = formData.get('content');

        if (typeof content !== 'string') {
            throw new Error('Provided content is not a string value.');
        }

        await globals.updateOne(
            { identifier: ABOUT_ME_IDENTIFIER, language },
            {
                $set: {
                    updatedAt: Date.now(),
                    identifier: ABOUT_ME_IDENTIFIER,
                    language,
                    html: content,
                } satisfies AboutMeDocument,
            },
            { upsert: true }
        );

        return json({
            type: 'success',
            message: `About me (${language}) updated successfully`,
        });
    } catch (error) {
        console.log(error);

        if (error instanceof Error) {
            return json({
                type: 'failure',
                message: 'An error occurred',
                messageBody: error.message,
            });
        }

        return json({
            type: 'failure',
            message: 'Unknown error',
        });
    }
}
