import type { Author, Locale } from "./types/global";

import { Breakpoint } from "./types/media";

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

export const WEBSITE_URL = "http://localhost:3000";

export enum Page {
    RESUME = '/resume'
}

export const SUPPORTED_LOCALES: Readonly<Locale[]> = ['en', 'pl'];

export const DEFAULT_LOCALE: Locale = 'en';

export const COMPANY_AUTHORIZATION_TIME_MS = TimeInSeconds.MONTH * 1000;

export enum ActionType {
    ADMIN_AUTH = 'admin-auth',
    ADMIN_LOGOUT ='admin-logout',
    COMPANY_REGISTRATION = 'company-registration',
    FIND_COMPANY = 'find-company',
    SEND_EMAIL = 'send-email'
}

export const AUTHOR: Readonly<Author> = {
    profileImage: '/images/profi-opt.jpg',
    birthday: "02.10.1998",
    github: 'https://github.com/mihoow',
    linkedin: 'https://www.linkedin.com/in/mwieczorek8',
};

export const BREAKPOINT_MAP: Readonly<Record<
    Breakpoint,
    { min: number; max: number }
>> = {
    smallMobile: { min: 0, max: 413 },
    mobile: { min: 414, max: 639 },
    wideMobile: { min: 640, max: 767 },
    tablet: { min: 768, max: 1023 },
    desktop: { min: 1024, max: 1439 },
    wideDesktop: { min: 1440, max: Infinity }
};
