declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGO_URI: string;
            ADMIN_PASSWORD: string;
            AUTH_COOKIE_SECRET: string;
            GMAIL_PASSWORD: string;
            CRYPTO_ALGORITHM: string;
            CRYPTO_KEY: string;
            CRYPTO_IV: string;
        }
    }
}

export {};
