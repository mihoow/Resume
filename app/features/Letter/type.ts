import type { Locale } from '~/types/global';
import type { Nullable } from '~/types/utils';

export type Recipient = Nullable<{
    names: string;
    surname: string;
    sex: 'male' | 'female';
    jobPosition: string;
}>

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
    name: string;
    language: Locale;
    html: string;
}

export type CoverLetterDocument = {
    companyCode: string;
    language: Locale;
    html: string;
    date: string | null;
    recipient: Recipient;
    company: CoverLetterCompany;
    contacts: CoverLetterContacts;
    showRecipient: boolean;
    templateName: string;
}

export type EditTextFormData = {
    language: Locale;
    html: string;
    nameAsTemplate: string | null;
    saveAs: 'template' | 'document' | 'template-and-document';
}