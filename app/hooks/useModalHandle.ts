import { useMemo, useState } from "react";

import type { ModalHandle } from "~/types/global";

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
