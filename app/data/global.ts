import type { DataFunctionArgs } from "~/types/global";

export const getAttributions = ({ t }: DataFunctionArgs) => [
    {
        text: t(
            'The above graphic was first created by',
            'Powyższa grafika została najpierw stworzona przez'
        ),
        link: {
            href: 'https://codepen.io/kingmeers/pen/vGKoxj',
            text: 'Samir Chahine'
        }
    },
    {
        text: t(
            'Logo created by',
            'Logo zostało stworzone przez'
        ),
        link: {
            href: 'https://www.vectorstock.com/royalty-free-vector/tech-m-logo-design-initial-technology-vector-34330944',
            text: 'VectorStock / Weasley99'
        }
    },
    {
        text: t(
            'All icons were downloaded from',
            'Wszystkie ikony zostały pobrane z'
        ),
        link: {
            href: 'https://icons.getbootstrap.com',
            text: 'icons.getbootstrap.com'
        }
    },
    {
        text: t(
            'Significant part of the design is based on',
            'Znaczna część designu jest wzorowana na'
        ),
        link: {
            href: 'https://flowbite-react.com',
            text: 'Flowbite React'
        }
    },
    {
        text: t(
            'You can view the source code on',
            'Możesz przejrzeć kod źródłowy na'
        ),
        link: {
            href: 'https://github.com/mihoow/Resume',
            text: 'github.com/mihoow/Resume'
        }
    }
];
