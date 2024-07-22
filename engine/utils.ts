const deepCopy = (obj: object) => {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // Return primitive types and null as-is
    }

    let copy = Array.isArray(obj) ? [] : {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            // @ts-ignore
            copy[key] = deepCopy(obj[key]);
        }
    }

    return copy;
}