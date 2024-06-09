import { TextInput } from '~/base/Forms/TextInput';
import { component } from '~/utils/component';
import { useTranslation } from '~/hooks/useTranslation';

export const SendEmailFields = component<{
    initialEmail: string;
    onEmailChange: (email: string) => void;
    initialTopic: string;
    onTopicChange: (topic: string) => void;
}>('SendEmailFields', function ({ className, initialEmail, onEmailChange, initialTopic, onTopicChange }) {
    const t = useTranslation();

    return (
        <div className={this.mcn(className)}>
            <TextInput
                type='email'
                name='email'
                placeholder={t('Your e-mail', 'Twój adres e-mail')}
                required
                defaultValue={initialEmail}
                onChange={({ target: { value } }) => onEmailChange(value)}
                className={this.__('Input', ['email'])}
            />
            <TextInput
                type='text'
                name='topic'
                placeholder={t('Topic', 'Temat')}
                required
                defaultValue={initialTopic}
                onChange={({ target: { value } }) => onTopicChange(value)}
                className={this.__('Input', ['topic'])}
            />
        </div>
    );
});
