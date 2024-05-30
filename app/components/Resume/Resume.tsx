import Aside from '../ResumeAside/Aside';
import Main from '../ResumeMain/Main';
import { component } from '~/utils/component';

type Props = {
    companyName: string;
};

export default component<Props>('Resume', function ({ className, companyName }) {
    return (
        <div className={this.mcn(className)}>
            <Aside className={this.__('Aside')} />
            <Main
                className={this.__('Main')}
                companyName={companyName}
            />
        </div>
    );
});
