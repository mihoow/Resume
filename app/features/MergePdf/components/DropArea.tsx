import { DragEvent, PropsWithChildren, useState } from 'react';

import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

export const DropArea = component<PropsWithChildren<{ onDrop: (files: File[]) => void }>>(
    'DropArea',
    function ({ className, onDrop, children }) {
        const [isHighlighted, setIsHighlighted] = useState(false);

        const t = useTranslation()

        const handleHighlight = (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsHighlighted(true);
        };

        const handleUnHighlight = (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsHighlighted(false);
        };

        const handleDrop = (e: DragEvent<HTMLDivElement>) => {
            handleUnHighlight(e);

            const {
                dataTransfer: { files },
            } = e;

            const validFiles = [...files].filter(({ type }) => type === 'application/pdf');

            if (validFiles.length === 0) return;

            onDrop(validFiles);
        };

        return (
            <div
                className={this.mcn(className, 'relative full-height')}
                onDragEnter={handleHighlight}
                onDragOver={handleHighlight}
                onDragLeave={handleUnHighlight}
                onDrop={handleDrop}
            >
                {children}
                {isHighlighted && (
                    <div
                        className={this.cn(
                            'absolute inset-0 -top-[var(--header-height)] z-[1]',
                            'flex items-center justify-center',
                            'text-[28px]/[30px] text-center bg-black text-white opacity-80'
                        )}
                    >
                        {t("Drop it like it's hot", 'Upuść tutaj')}
                    </div>
                )}
            </div>
        );
    }
);
