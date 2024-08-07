import { ComponentPropsWithoutRef } from 'react';
import { DropboxIcon } from '../icons/Dropbox';
import { GoogleDriveIcon } from '../icons/GoogleDrive';
import Media from '~/base/Media';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

const PdfButton = component<ComponentPropsWithoutRef<'button'>>(
    'PdfButton',
    function ({ className, children, ...props }) {
        return (
            <button
                type='button'
                className={this.mcn(
                    'inline-flex items-center justify-center cursor-pointer',
                    'bg-[#214761] text-white shadow-md hover:bg-[#132e41] transition-colors',
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

export const StartScreen = component('StartScreen', function ({ className }) {
    const t = useTranslation();

    const iconButtonClasses = this.cn('mt-[6px] mx-[6px] mb-2', 'w-9 h-9 rounded-full', 'wm:mt-[2px] wm:mb-1 wm:mx-0');

    return (
        <main className={this.mcn(className, 'w-screen p-6 text-[#47474f]')}>
            <div className='pt-2 px-6 pb-8'>
                <h1 className={this.cn('text-2xl font-semibold text-[#33333b] text-center', 't:text-[42px]/[52px]')}>
                    {t('Merge PDF files', 'Scal pliki PDF')}
                </h1>
                <h2 className={this.cn('mt-2 mx-auto max-w-[800px] text-base text-center', 't:text-xl')}>
                    {t(
                        'Combine PDFs in the order you want in the easiest way possible.',
                        'Połącz pliki PDF: w dowolnej kolejności, w najłatwiejszy możliwy sposób.'
                    )}
                </h2>
            </div>
            <div className={this.cn('mx-auto flex flex-wrap text-center', 'wm:relative wm:table')}>
                <PdfButton
                    className={this.cn(
                        'mb-3 w-full min-h-20 py-6 px-8 rounded-xl text-2xl',
                        'wm:w-auto wm:min-w-[330px]'
                    )}
                >
                    {t('Select PDF files', 'Wybierz pliki PDF')}
                </PdfButton>
                <div
                    className={this.cn(
                        'ml-auto inline-flex',
                        'wm:absolute wm:top-0 wm:flex wm:flex-col wm:ml-[calc(100%+12px)]'
                    )}
                >
                    <PdfButton className={iconButtonClasses}>
                        <GoogleDriveIcon />
                    </PdfButton>
                    <PdfButton className={iconButtonClasses}>
                        <DropboxIcon />
                    </PdfButton>
                </div>
                <Media min='wideMobile'>
                    <span className='text-sm'>{t('or drop PDFs here', 'lub upuść pdf-y tutaj')}</span>
                </Media>
            </div>
        </main>
    );
});
