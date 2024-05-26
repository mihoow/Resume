import { type ComponentProps } from 'react';
import { useContext } from 'use-context-selector';
import { component } from '~/utils/component';
import { ModalContext } from './Modal.context';
import { useTranslation } from '~/hooks/useTranslation';
import CloseIcon from '~/icons/Close';

export const ModalHeader = component<ComponentProps<'div'>>(
    'ModalHeader',
    function ({ className, children, ...props }) {
        const t = useTranslation();
        const { popup, onClose, headerId, closeRef } = useContext(ModalContext);

        return (
            <div
                className={this.cn(this.__({ isPopup: popup }), className)}
                {...props}
            >
                <h3
                    id={headerId}
                    className={this.__('Title')}
                >
                    {children}
                </h3>
                <button
                    ref={closeRef}
                    type='button'
                    aria-label={t('Close', 'Zamknij')}
                    className={this.__('Close')}
                    onClick={onClose}
                >
                    <CloseIcon />
                </button>
            </div>
        );
    }
);
