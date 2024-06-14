import { useMemo, useState } from "react";

import type { ModalHandle } from "~/types/global";
import { useSearchParams } from "@remix-run/react";

export function useModalHandle(): ModalHandle {
    const [isOpen, setIsOpen] = useState(false);

    return useMemo(() => {
        return {
            isOpen,
            open: () => setIsOpen(true),
            close: () => setIsOpen(false)
        }
    }, [isOpen])
}

export function useContactHandle(): ModalHandle {
    const [searchParams, setSearchParams] = useSearchParams()

    return useMemo(() => {
        return {
            isOpen: searchParams.has('contact'),
            open: () => setSearchParams((params) => {
                params.set('contact', 'open')

                return params
            }),
            close: () => setSearchParams((params) => {
                params.delete('contact')

                return params
            })
        }
    }, [searchParams, setSearchParams])
}
