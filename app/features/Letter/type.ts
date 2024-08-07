import type { Locale } from '~/types/global';
import type { Nullable } from '~/types/utils';

export type Recipient = Nullable<{
    names: string;
    surname: string;
    sex: 'male' | 'female';
    jobPosition: string;
}>;

export type CoverLetterCompany = Nullable<{
    name: string;
    addressLine1: string;
    addressLine2: string;
}>;

export type CoverLetterContacts = Nullable<{
    phone: string;
    email: string;
}>;

export type CoverLetterTemplate = {
    updatedAt: number;
    name: string;
    language: Locale;
    html: string;
};

export type CoverLetterDocument = {
    updatedAt: number;
    companyCode: string;
    language: Locale;
    html: string;
    date: string | null;
    recipient: Recipient;
    company: CoverLetterCompany;
    contacts: CoverLetterContacts;
    showRecipient: boolean;
};

export type EditTextFormData = {
    language: Locale;
    html: string;
    nameAsTemplate: string | null;
    saveAs: 'template' | 'document' | 'template-and-document';
};

export type TemplatesListItem = {
    name: string;
    language: Locale;
};

export type TemplatesByLanguage = Record<Locale, TemplatesListItem[]>;

export type AboutMeDocument = {
    updatedAt: number;
    identifier: string;
    language: Locale;
    html: string;
}
