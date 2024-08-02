import type { CoverLetterDocument, CoverLetterTemplate } from './type';

import type { DbCompanyData } from '~/types/global';

export function isLetterDocument(
    doc: Record<string, unknown>
): doc is CoverLetterDocument & { companies: DbCompanyData[] } {
    return 'companyCode' in doc;
}

export function isLetterTemplate(doc: Record<string, unknown>): doc is CoverLetterTemplate {
    return 'name' in doc && 'html' in doc;
}
