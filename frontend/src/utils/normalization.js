export const normalizeAll = (obj) => {
    obj = { ...obj };
    const normalized = {};

    if (Object.keys(obj). length !== 1) {
        throw new Error("Cannot normalize object that doesn't have exactly one key");
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

export const normalizeDetail = (obj) => {
    obj = { ...obj };
    const allKeys = Object.keys(obj);
    let type = null;
    const normalized = {};

    if (allKeys.includes("groupId")) {
        type = "event"
    } else if (allKeys.includes("organizerId")) {
        type = "group";
    }

    if (type) {
        // const detailKey = (type + "Details");
        const imageKey = (
            type.slice(0, 1).toUpperCase()
            + type.slice(1) + "Images"
        );
        // const images = obj[imageKey];
        // normalized[detailKey] = {};

        allKeys.forEach((key) => {
            if (obj[key] instanceof Array) {
                normalized[key] = [...obj[key]];
            } else if (obj[key] instanceof Object) {
                normalized[key] = { ...obj[key] };
            } else {
                normalized[key] = obj[key];
            }
        });



        const images = normalized[imageKey];
        normalized["previewImage"] = "";
        images.forEach((img) => {
            if (img.preview) {
                normalized["previewImage"] = img.url;
            }
        });
    }
    return normalized;
};
