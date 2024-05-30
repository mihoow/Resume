import Aside from '../ResumeAside/Aside';
import Main from '../ResumeMain/Main';
import { component } from '~/utils/component';

export default component('Resume', function ({ className }) {
    return (
        <div className={this.mcn(className)}>
            <Aside className={this.__('Aside')} />
            <Main className={this.__('Main')} />
        </div>
    );
});
