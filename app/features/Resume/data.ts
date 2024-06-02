import type { Certificate, Experience, LangLevel, Language, StackLevel } from "~/features/Resume/type";

import type { DataFunctionArgs } from "~/types/global";

export const aboutMeData = ({ t }: DataFunctionArgs) => {
    const ABOUT_ME_EN = `I am an ambitious web developer with a year of commercial experience. \
    My specialty is front-end, which I have been learning for over 4 years. \
    Although I have less experience with backend, I am currently developing in this direction. \
    I enjoy team work and I strive for high-quality and extensible code base. \
    I am constantly expanding my knowledge.`;

    const ABOUT_ME_PL = `Jestem ambitnym programistą stron internetowych z rocznym doświadczeniem komercyjnym. \
    Moją specjalnością jest front-end, którego uczę się już od ponad 4 lat. \
    Choć mam mniejsze doświadczenie z back-endem, obecnie rozwijam się w tym kierunku. \
    Lubię pracę zespołową. Staram się tworzyć wysokiej jakości, odporny na zmiany kod. \
    Ciągle poszerzam swoją wiedzę.`;

    return t(ABOUT_ME_EN, ABOUT_ME_PL)
}

export const scandiwebExperienceData = ({ t }: DataFunctionArgs): Experience => ({
    startDate: '10.2022',
    endDate: '09.2023',
    title: 'React developer',
    subject: { name: 'Scandiweb', link: 'https://scandiweb.com' },
    location: t('remotely', 'zdalnie'),
    labels: ['Magento', 'E-commerce', 'React', 'TypeScript', 'PHP'],
    description: t(
        'I learned plenty about nearly every aspect of magento e-commerce in a very practical way. I am mostly proud of great team-work me and my colleagues were able to accomplish. It taught me not only how to write a better code but also how to do so in an efficient and timely manner.',
        'Nauczyłem się wiele na temat prawie każdego aspektu "magento e-commerce" w bardzo praktyczny sposób. Jestem szczególnie dumny ze znakomitej pracy zespołowej, którą udało się osiągnąć mi i moim kolegom. Nauczyłem się nie tylko jak pisać lepszy kod, ale także jak wykonywać zadania efektywnie i na czas.'
    ),
    listTitle: t(
        'Throughout the year, I was responsible for various tasks',
        'W ciągu tego roku, byłem odpowiedzialny za różnorodne obszary'
    ),
    listItems: [
        {
            title: t(
                'Implementation or co-implementation of web components',
                'Tworzenie lub współtworzenie komponentów webowych'
            ),
            content: t(
                'slider, image gallery, calendar, product list, product filters and more',
                'slajder, galeria zdjęć, kalendarz, lista produktów, filtry produktów i więcej'
            ),
        },
        {
            title: t('Code reviews', 'Recenzje kodu'),
            content: t(
                'keeping an eye on project standards and often helping others achieve better results',
                'pilnowanie projektowych standardów oraz nierzadko pomaganie innym w osiąganiu lepszych rezultatów'
            ),
        },
        {
            title: t('Performance optimization', 'Optymalizacja wydajności'),
            content: t(
                'I was splitting code, preloading / prefetching critical resources, optimizing http requests and more. All to achieve the best core web vitals measurements and to make pages load as fast as possible',
                'Stosowałem metody takie jak: "code splitting", "preloading / prefetching" zasobów krytycznych, optymalizacja zapytań http i więcej. Wszystko aby zmaksymalizować podstawowe wskaźniki internetowe i aby strony ładowały się tak szybko jak to możliwe'
            ),
        },
        {
            title: t('Project "firefighting"', 'Projektowe "gaszenie pożarów"'),
            content: t(
                'fixing very diverse range of bugs or improving the quality of various front-end functionalities',
                'naprawianie bardzo różnorodnych błędów, niedoskonałości czy poprawa jakości różnych aspektów front-endu'
            ),
        },
    ],
});

export const languagesData = ({ t }: DataFunctionArgs) => {
    const languageLevels: Readonly<Record<LangLevel, string>> = {
        a1: t('Beginner', 'Podstawowy'),
        a2: t('Elementary', 'Elementarny'),
        b1: t('Intermediate', 'Średnio-zaawansowany'),
        b2: t('Upper-intermediate', 'Ponad średnio-zaawansowany'),
        c1: t('Advanced', 'Zaawansowany'),
        c2: t('Proficiency', 'Biegły'),
        native: t('Native', 'Ojczysty'),
    };

    const knownLanguages: Readonly<Language[]> = [
        { language: t('English', 'angielski'), level: 'c1' },
        { language: t('Polish', 'polski'), level: 'native' },
    ];

    return { languageLevels, knownLanguages }
}

export const myStackData = ({ t }: DataFunctionArgs): StackLevel[] => [
    {
        rating: 10,
        note: t(
            'over 4 years of learning and practising',
            'ponad 4 lata nauki i praktyki'
        ),
        items: ['HTML5', 'CSS (Sass)', 'Typescript', 'ReactJS'],
    },
    {
        rating: 8,
        note: t(
            'used sporadically throughout the years',
            'używałem sporadycznie w ciągu 4 lat'
        ),
        items: ['MongoDB', 'Redux', 'React Router', 'RemixJS', 'Radix UI', 'TailwindCSS', 'Git'],
    },
    {
        rating: 6,
        note: t(
            'EITHER I seriously studied but I lack serious practice\n OR I seriously practiced but I feel there is more to it',
            'ALBO poważnie studiowałem, ale brakuje mi poważnej praktyki\n ALBO poważnie praktykowałem, ale czuję, że mogę nauczyć się więcej'
        ),
        items: ['NodeJS', 'Redis', 'Apollo GraphQL', 'HTML5 Canvas', t('Web performance', 'Optymalizacja wydajności'), 'PWA'],
    },
    {
        rating: 4,
        note: t(
            'successfully used although lacking the depth of understanding',
            'z powodzeniem używałem, choć brakuje mi głębi zrozumienia'
        ),
        items: ['SocketIO', 'Magento 2', 'MySQL', 'Bootstrap', 'Figma', 'VueJS + Nuxt'],
    },
    {
        rating: 2,
        note: t(
            'basics, just scratched the surface',

        ),
        items: ['PHP', 'Docker', 'Jest', 'Cypress', 'NextJS'],
    },
]

export const additionalSkillsData = ({ t }: DataFunctionArgs) => [
    t('driver license (category B)', 'prawo jazdy kat. B')
];

export const hobbiesData = ({ t }: DataFunctionArgs) => [
    t(
        'currently databases and back-end related topics',
        'aktualnie bazy danych oraz tematy związane z "back-endem"'
    ),
    t(
        'popular science (in the form of books and podcasts)',
        'nauka popularna (w formie książek i podcastów)'
    ),
    t(
        'ski jumping (as a fan)',
        'skoki narciarskie (jako fan)'
    ),
];

export const certificatesData = (): Certificate[] => [
    { name: 'MongoDB Certified Associate Developer', link: 'https://drive.google.com/file/d/16whD5VznD9OYSVKkqFPAKyKrAp8Wv-NB/view?usp=sharing' },
    { name: 'Introduction to Redis Data Structures', link: 'https://drive.google.com/file/d/1w53D8CUU-gi52S9L0uGUDKGOtBOxhXsZ/view?usp=sharing' },
    { name: 'Redis Streams', link: 'https://drive.google.com/file/d/1hctpEkKL-mfZsPpqFwERb0OAU-xxyCCp/view?usp=sharing' },
    { name: 'Progressive Web Apps (PWA) - The Complete Guide', link: 'https://drive.google.com/file/d/1wdaOvsIvNrR-bEP_sSLPvXl63FaCj8p3/view?usp=sharing' }
]
