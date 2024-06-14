import type { ActionData, ValidationErrorData } from '~/types/global';

import type { AnyFunc } from '~/types/utils';
import type { ToastData } from '~/base/Toast/Toast.type';

export const noopFn = () => {};

export function shallowObjectCompare(a: Record<string, unknown>, b: Record<string, unknown>) {
    const aKeys = Object.keys(a);

    return aKeys.length === Object.keys(b).length && aKeys.every((key) => a[key] === b[key]);
}

export function isSameToast(toastA: ToastData, toastB: ToastData): boolean {
    return toastA.type === toastB.type && toastA.message === toastB.message && toastA.intent === toastB.intent;
}

export function isActionData(data: unknown, intent?: string): data is ActionData {
    if (!data || typeof data !== 'object') return false;

    const isValid = 'intent' in data && 'ok' in data && typeof data.ok === 'boolean';

    if (!isValid) return false;

    return !intent || data.intent === intent;
}

export function isValidationErrorData(data: unknown, intent?: string): data is ValidationErrorData {
    return isActionData(data, intent) && !data.ok && 'validationErrors' in data;
}
