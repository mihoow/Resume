import { ActionType, DEFAULT_LOCALE, Page } from '~/config';

import { Button } from '~/base/Button/Button';
import { ModalHandle } from '~/types/global';
import RichTextModal from '~/features/RichTextEditor/components/RichTextModal/RichTextModal';
import { Submit } from '~/base/Forms/Submit';
import { component } from '~/utils/component';
import { useEditorModal } from '~/features/RichTextEditor/context';
import { useLocale } from '~/hooks/useLocale';

const EditAboutMeFooter = component('EditAboutMeFooter', function ({ className }) {
    const flushAndClose = useEditorModal(({ flushAndClose }) => flushAndClose);

    return (
        <RichTextModal.Footer className={this.mcn(className)}>
            <Button onClick={flushAndClose}>Clear</Button>
            <Submit variant='submit'>Save</Submit>
        </RichTextModal.Footer>
    );
});

export const EditAboutMeModal = component<{ handle: ModalHandle; html: string; }>(
    'EditAboutMeModal',
    function ({ className, handle, html }) {
        const locale = useLocale();

        return (
            <RichTextModal
                className={this.mcn(className)}
                intent={ActionType.EDIT_ABOUT_ME}
                action={null}
                storageKeyPrefix={`about-me:${locale}`}
                handle={handle}
                content={html}
            >
                <RichTextModal.Header title='Edit about me' />
                <RichTextModal.Body />
                <EditAboutMeFooter />
            </RichTextModal>
        );
    }
);
