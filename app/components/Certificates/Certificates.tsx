import Link from '~/base/Link';
import { certificatesData } from '~/data/resume';
import { component } from '~/utils/component';
import { useData } from '~/hooks/useData';

export default component('Certificates', function ({ className }) {
    const certificates = useData(certificatesData)

    return (
        <ul className={this.mcn(className, this.__({ isBig: certificates.length > 4 }))}>
            {certificates.map(({ name, link }) => (
                <li
                    key={link}
                    id={link}
                    className={this.__('Item')}
                >
                    <Link
                        type='native'
                        newTab
                        to={link}
                    >
                        {name}
                    </Link>
                </li>
            ))}
        </ul>
    );
});
