import { CoverLetterData } from "./type";
import { Locale } from "~/types/global";
import { connectToDatabase } from "~/services/db.server";
import { readToken } from "~/services/authToken.server";

export function getCompanyCodeFromUrl(url: string) {
    const { searchParams } = new URL(url);
    const token = searchParams.get('token');

    if (!token || token === 'public') return null;

    try {
        const { companyCode } = readToken(token)

        return companyCode
    } catch {
        return null;
    }
}

export async function getCoverLetter(companyCode: string | null, language: Locale) {
    // TODO: it's important to get also a company data and check if it's not expired

    const db = await connectToDatabase();
    const collection = db.db('resume').collection('cover-letters');

    const coverLetters = await collection.find<CoverLetterData>({
        $or: [
            { companyCode },
            { nameAsTemplate: 'default', language }
        ]
    }).toArray();

    if (coverLetters.length === 0) return null;

    if (coverLetters.length === 1) {
        return coverLetters[0];
    }

    return coverLetters.find((letter) => letter.companyCode === companyCode) || null;
}
