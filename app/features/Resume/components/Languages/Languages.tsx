import { LANGUAGE_LEVELS } from '../../config';
import type { LangLevel } from '../../type';
import { component } from '~/utils/component';
import { languagesData } from '../../data';
import { useData } from '~/hooks/useData';

const Rating = component<{
    level: LangLevel;
}>('Rating', function ({ className, level }) {
    const levelIndex =
        level === 'native' ? LANGUAGE_LEVELS.length - 1 : LANGUAGE_LEVELS.findIndex((name) => name === level);

    return (
        <div className={this.mcn(className)}>
            {LANGUAGE_LEVELS.map((name, i) => (
                <span
                    key={name}
                    className={this.__('Square', { isFilled: i <= levelIndex })}
                />
            ))}
        </div>
    );
});

export default component('Languages', function ({ className }) {
    const { languageLevels, knownLanguages } = useData(languagesData)

    return (
        <ul className={this.mcn(className)}>
            {knownLanguages.map(({ language, level }) => (
                <li
                    key={language}
                    className={this.__('Item')}
                >
                    <span className={this.__('Name')}>{language}</span>
                    <div className={this.__('ItemRow')}>
                        <Rating level={level} />
                        <span className={this.__('LevelName')}>
                            {level !== 'native' && (
                                <>
                                    {level.toUpperCase()}
                                    {' - '}
                                </>
                            )}
                            {languageLevels[level]}
                        </span>
                    </div>
                </li>
            ))}
        </ul>
    );
});
