import { MongoClient, ServerApiVersion } from 'mongodb';

declare global {
    var __db: MongoClient | undefined;
}

let db: MongoClient;

async function connectToDatabase() {
    if (db) return db;

    const client = new MongoClient(process.env.MONGO_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    if (process.env.NODE_ENV === 'production') {
        db = await client.connect();
    } else {
        // in development, need to store the db connection in a global variable
        // this is because the dev server purges the require cache on every request
        // and will cause multiple connections to be made
        if (!global.__db) {
            global.__db = await client.connect();
        }

        db = global.__db;
    }

    return db;
}

connectToDatabase();

export { connectToDatabase };
