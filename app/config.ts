import type { Author } from "./types/resume";
import type { Locale } from "./types/global";

export const SUPPORTED_LOCALES: Readonly<Locale[]> = ['en', 'pl'];

export const DEFAULT_LOCALE: Locale = 'en';

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
