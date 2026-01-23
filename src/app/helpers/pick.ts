const pick = <T extends Record<string, any>, K extends readonly (keyof T)[]>(
    obj: T,
    keys: K
): Partial<T> => {
    const finalObject: Partial<T> = {};

    for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            finalObject[key] = obj[key];
        }
    }

    return finalObject;
};

export default pick;
