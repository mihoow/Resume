import type { Locale } from '~/types/global';
import { Nullable } from '~/types/utils';

type RecipientIdentity = {
    names?: string;
    surname: string;
    sex: 'male' | 'female';
};

type RecipientJobPosition = {
    jobPosition: string;
};

export type Recipient = RecipientIdentity | RecipientJobPosition | (RecipientIdentity & Partial<RecipientJobPosition>);

export type CoverLetterCompany = {
    name: string;
    addressLine1: string;
    addressLine2?: string;
};

export type CoverLetterContacts = {
    phone?: string;
    email?: string;
};

export type CoverLetterData = {
    language: Locale;
    html: string;
    showRecipient: boolean;
} & Nullable<{
    companyCode?: string;
    date?: string;
    recipient?: Recipient;
    contacts?: CoverLetterContacts;
    nameAsTemplate?: string;
}>;
