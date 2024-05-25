import { Rating as StarRating } from 'react-simple-star-rating';
import { component } from '~/utils/component';
import { myStackData } from '~/data/resume';
import { useData } from '~/hooks/useData';

export default component('Stack', function ({ className }) {
    const stackList = useData(myStackData);

    return (
        <ul className={this.mcn(className)}>
            {stackList.map(({ rating, note, items }) => (
                <li
                    key={rating}
                    className={this.__('Level')}
                >
                    <StarRating
                        initialValue={rating / 2}
                        iconsCount={5}
                        readonly
                        allowFraction
                        size={20}
                        className={this.__('Rating')}
                    />
                    {note && (
                        <p className={this.__('Note')}>
                            {note.split('\n').map((subText, i) => (
                                <span key={i}>{subText}</span>
                            ))}
                        </p>
                    )}
                    <ul className={this.__('ItemsList')}>
                        {items.map((item) => (
                            <li
                                key={item}
                                className={this.__('Item')}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
});
