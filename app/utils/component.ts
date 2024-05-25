import type { MutableRefObject, ReactNode } from "react";

import bem from "bem-ts";
import { memo } from "react";

export type ComponentThis = {
    mcn: typeof className;
    cn: typeof className;
    __: ReturnType<typeof bem>
};

export type ComponentRefType<R> = MutableRefObject<R> | ((value: R | null) => void);

export type ComponentProps<P = {}, R = never> = P & {
    className?: string;
    myRef?: ComponentRefType<R>;
}

export type PropsAreEqualFn<P, R> = (
    prevProps: Readonly<ComponentProps<P, R>>,
    nextProps: Readonly<ComponentProps<P, R>>
) => boolean;

type ClassArg = string | null | undefined | false;

export function className(...classes: ClassArg[]): string {
    return classes.reduce<string>((className, subClass) => {

        if (!subClass) {
            return className
        }

        return `${className} ${subClass.trim()}`
    }, '').trim()
}

export function component<
    P = {},
    R = HTMLDivElement
>(
    displayName: string,
    component: (
        this: ComponentThis,
        props: ComponentProps<P, R>
    ) => ReactNode,
    propsAreEqual?: PropsAreEqualFn<P, R>
) {
    const __ = bem(displayName)

    const ComponentWithUtils = component.bind({
        mcn: (...classes: ClassArg[]) => className(displayName, ...classes),
        cn: className,
        __
    })

    const MemoizedComponent = propsAreEqual
        ? memo(ComponentWithUtils, propsAreEqual)
        : memo(ComponentWithUtils)

    MemoizedComponent.displayName = displayName

    return MemoizedComponent
}
