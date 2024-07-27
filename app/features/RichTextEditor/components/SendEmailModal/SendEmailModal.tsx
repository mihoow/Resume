import { ActionType } from '~/config';
import EditorModal from '../EditorModal/EditorModal';
import { Footer } from '../Footer/Footer';
import { SendEmailFields } from '../SendEmailFields/SendEmailFields';
import { SendIcon } from '../../icons/Send';
import { Submit } from '~/base/Forms/Submit';
import { component } from '~/utils/component';
import { useContactHandle } from '~/hooks/useModalHandle';
import { useEditorModal } from '../../context';
import { usePreservedState } from '../../hooks/usePreservedState';
import { useTranslation } from '~/hooks/useTranslation';

const SendEmailHeader = component('SendEmailHeader', function ({ className }) {
    const t = useTranslation();
    const breakpoint = useEditorModal(({ breakpoint }) => breakpoint);

    return (
        <EditorModal.Header
            title={t('Contact me', 'Skontaktuj się')}
            className={this.mcn(className)}
        >
            {breakpoint === 'mobile' && (
                <Submit
                    variant='submit'
                    className={this.__('MobileSubmit')}
                    loadingText=''
                >
                    <SendIcon />
                </Submit>
            )}
        </EditorModal.Header>
    );
});

const SendEmailBody = component('SendEmailBody', function ({ className }) {
    const stateController = useEditorModal(({ preservedStateController }) => preservedStateController);
    const [email, onEmailChange] = usePreservedState(stateController, { key: 'email' });
    const [topic, onTopicChange] = usePreservedState(stateController, { key: 'topic' });

    return (
        <EditorModal.Body
            className={this.mcn(className)}
            editorClassName={this.__('Editor')}
        >
            <SendEmailFields
                initialEmail={email}
                onEmailChange={onEmailChange}
                initialTopic={topic}
                onTopicChange={onTopicChange}
                className={this.__('Inputs')}
            />
        </EditorModal.Body>
    );
});

const SendEmailFooter = component('SendEmailFooter', function ({ className }) {
    const breakpoint = useEditorModal(({ breakpoint }) => breakpoint);
    const flushAndClose = useEditorModal(({ flushAndClose }) => flushAndClose);

    if (breakpoint !== 'desktop') return null;

    return (
        <EditorModal.Footer className={this.mcn(className)}>
            <Footer onDismiss={flushAndClose} />
        </EditorModal.Footer>
    );
});

export const SendEmailModal = component('SendEmailModal', function ({ className }) {
    const contactModalHandler = useContactHandle();

    return (
        <EditorModal
            handle={contactModalHandler}
            intent={ActionType.SEND_EMAIL}
            addInlineStyles
            className={this.mcn(className)}
        >
            <SendEmailHeader />
            <SendEmailBody />
            <SendEmailFooter />
        </EditorModal>
    );
});

export default SendEmailModal;
