import type { Author } from "./types/resume";
import type { Locale } from "./types/global";

export enum TimeInSeconds {
    MS = 1000,
    SECOND = 1,
    MINUTE = 60,
    HOUR = 3600,
    DAY = 86400,
    WEEK = 604800,
    MONTH = 2629746,
    YEAR = 31556952
}

export const SUPPORTED_LOCALES: Readonly<Locale[]> = ['en', 'pl'];

export const DEFAULT_LOCALE: Locale = 'en';

export const COMPANY_AUTHORIZATION_TIME_MS = TimeInSeconds.MONTH * 1000;

export enum ActionType {
    ADMIN_AUTH = 'admin-auth',
    ADMIN_LOGOUT ='admin-logout',
    COMPANY_REGISTRATION = 'company-registration'
}

export const AUTHOR: Readonly<Author> = {
    profileImage: '/images/profi-opt.jpg',
    birthday: "02.10.1998",
    address: '******* *********',
    email: '***********',
    github: 'https://github.com/mihoow',
    linkedin: 'https://www.linkedin.com/in/mwieczorek8',
    phone: {
        areaCode: '**',
        tel: '*********',
    },
};

export const LANGUAGE_LEVELS: Readonly<string[]> = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
