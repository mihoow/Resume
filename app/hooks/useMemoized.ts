import { useEffect, useState } from 'react';

import { useMirrorRef } from './useMirrorRef';

export function useMemoized<T>(value: T, isValueEqual: (currValue: T, nextValue: T) => boolean): T {
    const [currentValue, setCurrentValue] = useState(value);

    const isValueEqualRef = useMirrorRef(isValueEqual);

    useEffect(() => {
        setCurrentValue((current) => {
            if (isValueEqualRef.current(current, value)) {
                return current;
            }

            return value;
        });
    }, [value]);

    return currentValue;
}
