import { FILES_INPUT_ID } from '../config';
import { StartScreen } from './StartScreen';
import { component } from '~/utils/component';

export const MergePDFs = component('MergePDFs', function ({ className }) {
    return (
        <>
            <input
                id={FILES_INPUT_ID}
                type='file'
                multiple
                accept='.pdf'
                tabIndex={-1}
                className='sr-only'
                onChange={(e) => console.log('>>files', e)}
            />
            <StartScreen />
        </>
    );
});
