import { INLINE_STYLE_RULES } from "./config/editor";
import type { NoReadonlyKeys } from "~/types/utils";

export function styles(...inlineStyles: string[]): string {
    return inlineStyles.join(' ');
}

export function applyStyles(...inlineStyles: string[]) {
    return {
        HTMLAttributes: {
            style: inlineStyles.join(' '),
        },
    };
}

export function addInlineStylesToHTML(html: string) {
    const div = document.createElement('div');
    const wrapper = document.createElement('div');

    wrapper.innerHTML = html;
    div.appendChild(wrapper)

    INLINE_STYLE_RULES.forEach(({ selector, styles }) => {
        const elements = [...div.querySelectorAll(selector)]

        elements.forEach((el) => {
            if (!(el instanceof HTMLElement)) return;

            const stylesObject = typeof styles === 'function' ? styles(el) : styles

            Object.entries((stylesObject)).forEach(([property, cssValue]) => {
                el.style[(property as keyof NoReadonlyKeys<CSSStyleDeclaration>)] = cssValue
            })
        })
    })

    return div.innerHTML
}
