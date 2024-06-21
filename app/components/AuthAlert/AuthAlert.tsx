import { Alert } from '~/base/Alert/Alert';
import { AuthStatus } from '~/types/global';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

const NoTokenAlert = component('NoTokenAlert', function ({ className }) {
    const t = useTranslation();

    return (
        <Alert
            color='warning'
            title={t('No token', 'Brak tokenu')}
            className={this.mcn(className)}
        >
            <div>
                <p>
                    {t(
                        `There is no token to validate your identity.
                        In this case, I can't show you my sensitive information
                        (address, phone number etc.) and you might miss some customized content.`,
                        `Brakuje tokenu, który by potwierdził Twoją tożsamość.
                        W takim wypadku nie mogę pokazać swoich danych poufnych
                        (adres, numer telefonu itp.) oraz może brakować przygotowanych specjalnie dla Ciebie zawartości.
                        `
                    )}
                </p>
                <p>{t('This is exactly as expected if:', 'Wszystko jest w porządku, jeśli:')}</p>
                <ul>
                    <li>
                        {t(
                            "you've used a link that is publicly available?",
                            'użył_ś linku, który jest publicznie dostępny?'
                        )}
                    </li>
                    <li>{t("you've found this website accidentally?", 'znalazł_ś tę stronę przypadkowo?')}</li>
                </ul>
                <p>
                    {t(
                        'In other case, just ensure you copy the full link I shared with you.',
                        'W innym przypadku, upewnij się by skopiować cały link, który Ci udostępniłem.'
                    )}
                </p>
            </div>
        </Alert>
    );
});

const ServerErrorAlert = component('ServerErrorAlert', function ({ className }) {
    const t = useTranslation();

    return (
        <Alert
            color='warning'
            title={t('Server error during authorization', 'Błąd serwera podczas autoryzacji')}
            className={this.mcn(className)}
        >
            <div>
                <p>
                    {t(
                        `I'm sorry, something wrong on the server.
                    For now, I can't show you my sensitive information
                    (address, phone number etc.) and you might miss some customized content.`,
                        `Przykro mi, wystąpił jakiś błąd po stronie serwera.
                    Póki co, nie mogę pokazać swoich danych poufnych
                    (adres, numer telefonu itp.) oraz może brakować przygotowanych specjalnie dla Ciebie zawartości.
                    `
                    )}
                </p>
                <p>
                    {t(
                        "Although it's not a critical error and everything works, I recommend you return a bit later.",
                        'Choć nie jest to krytyczny błąd i wszystko działa, polecam wrócić trochę później.'
                    )}
                </p>
            </div>
        </Alert>
    );
});

const InvalidTokenAlert = component('InvalidTokenAlert', function ({ className }) {
    const t = useTranslation();

    return (
        <Alert
            color='warning'
            title={t('Invalid token', 'Nieprawidłowy token')}
            className={this.mcn(className)}
        >
            <p>
                {t(
                    `URL address contains a broken token.
                    In this case, I can't show you my sensitive information
                    (address, phone number etc.) and you might miss some customized content.`,
                    `Adres URL zawiera nieprawidłowy token.
                    W takim wypadku nie mogę pokazać swoich poufnych danych
                    (adres, numer telefonu itp.) oraz może brakować przygotowanych specjalnie dla Ciebie zawartości.`
                )}
            </p>
            <p>
                {t(
                    `It's possible you copied the provided link incorrectly (please check).`,
                    `Możliwe, że niedokładnie skopiował_ś link (proszę sprawdzić).`
                )}
            </p>
        </Alert>
    );
});

const ExpiredTokenAlert = component('ExpiredTokenAlert', function ({ className }) {
    const t = useTranslation();

    return (
        <Alert
            color='warning'
            title={t('Expired token', 'Twoja autoryzacja wygasła')}
            className={this.mcn(className)}
        >
            <p>
                {t(
                    `You are no longer authorized to see my sensitive information
                    (address, phone number etc.) and you might miss some customized content.`,
                    `Nie jesteś już upoważnion_ do przeglądania moich danych poufnych
                    (adres, numer telefonu itp.) oraz może brakować przygotowanych specjalnie dla Ciebie zawartości.
                    `
                )}
            </p>
            <p>
                {t(
                    'If you want, just send me a message and I will authorize you again.',
                    'Jeśli tylko chcesz, napisz do mnie wiadomość, a upoważnię Cię znowu.'
                )}
            </p>
        </Alert>
    );
});

export const AuthAlert = component<{ authStatus: AuthStatus }>('AuthAlert', function ({ className, authStatus }) {
    switch (authStatus) {
        case 'no-token':
            return <NoTokenAlert className={this.mcn(className)} />;
        case 'server-error':
            return <ServerErrorAlert className={this.mcn(className)} />;
        case 'invalid-token':
            return <InvalidTokenAlert className={this.mcn(className)} />;
        case 'expired-token':
            return <ExpiredTokenAlert className={this.mcn(className)} />;
        default:
            return null;
    }
});
