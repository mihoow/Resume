import type { SensitiveAuthorInfo } from "~/types/global";
import { connectToDatabase } from "./db.server";

export async function fetchSensitiveAuthorInfo(): Promise<SensitiveAuthorInfo | null> {
    try {
        const db = await connectToDatabase();
        const collection =  db.db('resume').collection('globals');

        return collection.findOne<SensitiveAuthorInfo>({ identifier: 'sensitive-author-info' });

    } catch (error) {
        console.log(error)

        return null;
    }
}
