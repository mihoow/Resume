import { useEffect, useRef, useState } from 'react';

import { CopyIcon } from '~/icons/Copy';
import type { ReactNode } from 'react';
import Tooltip from '../Tooltip';
import bem from 'bem-ts';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

type Props = {
    value: string;
    children?: (isCopied: boolean, renderIcon: () => ReactNode) => ReactNode;
};

async function copyTextToClipboard(text: string) {
    if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(text);
    }

    return document.execCommand('copy', true, text);
}

const __ = bem('CopyToClipboard');

export default component<Props>('CopyToClipboard', function ({ className, children, value }) {
    const t = useTranslation();
    const [isCopied, setIsCopied] = useState(false);

    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        },
        []
    );

    async function handleCopy() {
        await copyTextToClipboard(value);
        setIsCopied(true);

        timeout.current = setTimeout(() => {
            setIsCopied(false);
        }, 1500);
    }

    function renderIcon() {
        return (
            <Tooltip
                content={t('Copied!', 'Skopiowano!')}
                placement='top'
                isEnabled={isCopied}
            >
                <CopyIcon />
            </Tooltip>
        );
    }

    return (
        <button
            className={`${__()} ${className}`.trim()}
            onClick={handleCopy}
            aria-label={t('Copy to clipboard', 'Kopiuj do schowka')}
        >
            {children ? children(isCopied, renderIcon) : renderIcon()}
        </button>
    );
});
