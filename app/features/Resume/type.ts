import type { ArrayItem } from "../../types/utils";
import type { LANGUAGE_LEVELS } from "./config";

export type LangLevel = ArrayItem<typeof LANGUAGE_LEVELS> | 'native';

export type Language = {
    language: string;
    level: LangLevel;
};

export type Certificate = {
    name: string;
    link: string;
};

export type StackLevel = {
    rating: number;
    note?: string;
    items: string[];
};

export type Experience = {
    startDate: string;
    endDate: string;
    title: string;
    subject: string | { name: string; link: string; };
    location?: string;
    labels?: string[];
    description?: string;
    listTitle?: string;
    listItems?: Array<string | { title: string; content: string; }>
};

