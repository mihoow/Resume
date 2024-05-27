import type { DataFunctionArgs } from "~/types/global";

export const getServerMessages = ({ t }: DataFunctionArgs) => ({
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
    unknownServerError: t(
        'Server error occurred',
        'Wystąpił błąd po stronie serwera'
    ),
    unknownServerErrorBody: t(
        "I'm sorry, it's not your fault. Please try again or come back later.",
        'Przykro mi, to nie jest Twoja wina. Proszę spróbuj ponownie bądź wróć później.'
    )
})

export type ServerMessageKey = keyof ReturnType<typeof getServerMessages>;
