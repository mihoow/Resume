import Aside from '../ResumeAside/Aside';
import Main from '../ResumeMain/Main';
import { component } from '~/utils/component';

type Props = {
    companyName: string;
    isAdmin?: boolean;
};

export default component<Props>('Resume', function ({ className, companyName, isAdmin = false }) {
    return (
        <div className={this.mcn(className)}>
            <Aside className={this.__('Aside')} />
            <Main
                className={this.__('Main')}
                companyName={companyName}
                isAdmin={isAdmin}
            />
        </div>
    );
});
