import type { DataFunctionArgs } from "~/types/global";

export const getServerMessages = ({ t }: DataFunctionArgs) => ({
    // admin login
    passwordEmpty: t(
        'Password cannot be empty.',
        'Hasło nie może być puste'
    ),
    passwordIncorrect: t(
        'Incorrect password.',
        'Nieprawidłowe hasło.'
    ),
    adminAuthSuccess: t(
        'Authenticated as admin',
        'Uwierzytelniono jako admin'
    ),
    // company authorization
    companyCodeInvalidType: 'Company code must be a text value',
    companyCodeInvalidLength: 'Company code needs to be exactly 4 characters long',
    companyNameInvalidType: 'Company name needs to be a text value',
    notAdmin: 'You are not an admin!',
    duplicatedCompanyCode: 'Company of this code already exists.',
    // globals
    unknownServerError: t(
        'Server error occurred',
        'Wystąpił błąd po stronie serwera'
    ),
    unknownServerErrorBody: t(
        "I'm sorry, it's not your fault. Please try again or come back later.",
        'Przykro mi, to nie jest Twoja wina. Proszę spróbuj ponownie bądź wróć później.'
    ),
})

export type ServerMessageKey = keyof ReturnType<typeof getServerMessages>;
