import { ChangeEvent, useState } from 'react';

import { DropArea } from './DropArea';
import { FILES_INPUT_ID } from '../config';
import { StartScreen } from './StartScreen';
import { component } from '~/utils/component';

export const MergePDFs = component('MergePDFs', function ({ className }) {
    const [files, setFiles] = useState<File[]>([]);

    const handleDrop = (files: File[]) => setFiles((currFiles) => [...currFiles, ...files]);

    const handleInputChange = ({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
        if (!files) return;

        setFiles((currFiles) => [...currFiles, ...[...files]]);
    };

    return (
        <DropArea onDrop={handleDrop}>
            <input
                id={FILES_INPUT_ID}
                type='file'
                multiple
                accept='.pdf'
                tabIndex={-1}
                className='sr-only'
                onChange={handleInputChange}
            />
            <StartScreen />
        </DropArea>
    );
});
