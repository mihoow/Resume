import { createCipheriv, createDecipheriv } from 'node:crypto';

import { nanoid } from 'nanoid';

export function encrypt(text: string) {
    const {
        VITE_CRYPTO_ALGORITHM,
        VITE_CRYPTO_KEY,
        VITE_CRYPTO_IV
    } = import.meta.env

    const cipher = createCipheriv(
        VITE_CRYPTO_ALGORITHM,
        Buffer.from(VITE_CRYPTO_IV, 'hex'),
        Buffer.from(VITE_CRYPTO_KEY, 'hex')
    );

    return Buffer.concat([cipher.update(text), cipher.final()]).toString('hex');
}

export function decrypt(text: string) {
    const {
        VITE_CRYPTO_ALGORITHM,
        VITE_CRYPTO_KEY,
        VITE_CRYPTO_IV
    } = import.meta.env

    const decipher = createDecipheriv(
        VITE_CRYPTO_ALGORITHM,
        Buffer.from(VITE_CRYPTO_IV, 'hex'),
        Buffer.from(VITE_CRYPTO_KEY, 'hex')
    );

    const encrypted = Buffer.from(text, 'hex');

    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString()
}

export function createToken(companyCode: string) {
    const base64Code = Buffer.from(companyCode).toString('base64url');
    const password = nanoid(9);

    return {
        token: `${base64Code}.${password}`,
        encryptedPassword: encrypt(password)
    }
}

export function getToken(companyCode: string, encryptedPassword: string): string {
    const base64Code = Buffer.from(companyCode).toString('base64url');

    return `${base64Code}.${decrypt(encryptedPassword)}`
}

export function readToken(token: string) {
    const [base64CompanyCode, password] = token.split('.')

    return {
        companyCode: Buffer.from(base64CompanyCode, 'base64url').toString('utf-8'),
        password
    }
}

export function doPasswordsMatch(password: string, encryptedPassword: string) {
    return password === decrypt(encryptedPassword)
}
