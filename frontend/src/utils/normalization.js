export const normalizeAll = (obj) => {
    obj = { ...obj };
    const normalized = {};

    if (Object.keys(obj). length !== 1) {
        throw new Error("Cannot normalize object that doesn't have exactly one key");
        return;
    }
    // all groups / events returned in an object with a single
    // key ("Groups" / "Events") whose value is an array
    const objType = Object.keys(obj)[0];
    // extract array from object
    const objArr = [...obj[objType]];
    const idList = makeIdList(objArr);

    objArr.forEach((obj) => {
        normalized[obj.id] = {...obj};
    });

    return [normalized, idList];
};

const makeIdList = (objArr) => {
    objArr.sort((objX, objY) => {
        return (objX.id - objY.id);
    });
    const idList = objArr.map((obj) => obj.id);
    return idList;
};
