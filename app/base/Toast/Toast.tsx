import type { AnimationEvent, CSSProperties, ComponentPropsWithoutRef } from 'react';
import type { ToastData, ToastRef } from './Toast.type';
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { CheckIcon } from '~/icons/Check';
import CloseIcon from '~/icons/Close';
import { ExclamationTriangle } from '~/icons/ExclamationTriangle';
import { component } from '~/utils/component';
import { useMirrorRef } from '~/hooks/useMirrorRef';
import { useTranslation } from '~/hooks/useTranslation';

const TRANSITION_DURATION = 300;

type ToastProps = ToastData & {
    onRemoval?: (data: ToastData) => void;
    isInsideList?: boolean;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

const ToastClose = component<{ onClose: VoidFunction }>('ToastClose', function ({ className, onClose }) {
    const t = useTranslation();

    return (
        <button
            type='button'
            aria-label={t('Close', 'Zamknij')}
            className={this.mcn(className)}
            onClick={onClose}
        >
            <CloseIcon />
        </button>
    );
});

export const Toast = component<ToastProps, ToastRef>(
    'Toast',
    function ({
        className,
        intent,
        type,
        message,
        autoClose = false,
        onRemoval,
        isInsideList = false,
        myRef,
        ...props
    }) {
        const progressBarRef = useRef<HTMLDivElement | null>(null);
        const timeoutRef = useRef<NodeJS.Timeout>();
        const [isClosed, setIsClosed] = useState(false);
        const [isRemoved, setIsRemoved] = useState(false);

        const handleClose = useCallback(() => {
            console.log('>>1123')
            setIsClosed(true);
        }, []);

        const handleAnimationEnd = ({ animationName, ...e }: AnimationEvent<HTMLSpanElement>) => {
            if (animationName !== 'progress') return;

            handleClose()
        }

        const resetAnimation = useCallback(() => {
            const { current: el } = progressBarRef;

            if (!el) return;

            // that's the only working way of resetting the animation I could find
            el.classList.remove('playing');
            el.classList.add('waiting')
            setTimeout(() => {
                el.classList.add('playing')
                el.classList.remove('waiting')
            }, 10)
        }, []);

        const effectArgs = useMirrorRef({
            intent,
            type,
            message,
            onRemoval,
        })

        useEffect(() => {
            if (!isClosed) return;

            const { intent, type, message, onRemoval } = effectArgs.current

            timeoutRef.current = setTimeout(() => {
                setIsRemoved(true);
                onRemoval?.({ type, message, intent });
            }, TRANSITION_DURATION);

            return () => clearTimeout(timeoutRef.current);
        }, [effectArgs, isClosed])

        useImperativeHandle(myRef, () => ({ hide: handleClose, resetAnimation }), [handleClose, resetAnimation]);

        if (isRemoved) return null;

        const Icon = type === 'success' ? CheckIcon : ExclamationTriangle;

        return (
            <div
                role='alert'
                className={this.cn(this.__({ isInsideList, isClosed }), className)}
                style={{ '--transition-duration': `${TRANSITION_DURATION}ms` } as CSSProperties}
                {...props}
            >
                <div className={this.__('Content')}>
                    <div className={this.__('IconWrapper', [type])}>
                        <Icon />
                    </div>
                    <p className={this.__('Message')}>{message}</p>
                </div>
                <ToastClose onClose={handleClose} />
                {autoClose && (
                    <span
                        aria-hidden
                        className={this.__('ProgressBar')}
                    >
                        <span
                            ref={progressBarRef}
                            className={this.cn(this.__('Bar', [type]), 'playing')}
                            onAnimationEnd={handleAnimationEnd}
                        />
                    </span>
                )}
            </div>
        );
    }
);
