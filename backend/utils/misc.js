// backend/utils/misc.js

const { Event, Group, Venue, Image, User, Membership, Attendance } = require('../../db/models');

const defaultUnauthorized = {
    "message": "Forbidden",
    "statusCode": 403
  };

// takes in an array of image json objects and a
// string indicating the image type (group or event)
// and returns the url of a preview image
const extractPreviewImageURL = (images, type) => {
    const previewKey = (type + "Preview");
    let previewImage = "No preview image";
    images.forEach((image) => {
        if (image[previewKey]) {
            previewImage = image.url;
        }
    });
    return previewImage;
};

const formatDate = (date) => {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    let dateStr = "";
    let month = ""

    // Date.toString() has output of form:
    // "Tue Aug 19 1975 23:15:30 GMT+0200 (CEST)"
    // Want output of form: "1975-08-19 23:15:30"

    const dateArr = date.toString().split(' ');

    month += (months.indexOf(dateArr[1]) + 1);
    if (month.length === 1) month = ('0' + month);

    dateStr += (dateArr[3] + '-' + month + '-' + dateArr[2] + ' ' + dateArr[4]);

    return dateStr;
};

// takes in a Group with Membership and Image
// models included, and returns a formatted JSON
// object with previewImage and numMembers keys
// in place of the included model keys.
// also formats timestamps
const formatGroup = (group) => {
    const formattedGroup = group.toJSON();

    if ("createdAt" in formattedGroup) {
        formattedGroup.createdAt = formatDate(formattedGroup.createdAt);
    }
    if ("updatedAt" in formattedGroup) {
        formattedGroup.updatedAt = formatDate(formattedGroup.updatedAt);
    }

    if ("Members" in formattedGroup) {
        formattedGroup.numMembers = formattedGroup.Members.length;
        delete formattedGroup.Members;
    }

    if ("GroupImages" in formattedGroup) {
        formattedGroup.previewImage = extractPreviewImageURL(formattedGroup.GroupImages, "group");
        delete formattedGroup.GroupImages;
    }

    return formattedGroup;
};

// Takes in an image and a string indicating the image
// type (group or event) and returns a json image object
// with only id, url, and the appropriate preview keys
const formatImage = (image, type) => {
    const fImage = image.toJSON();
    const validTypes = ["group", "event"];
    const trashKeys = ["Id", "Preview"]
    const previewKey = (type + trashKeys[1]);

    fImage.preview = fImage[previewKey];

    for (let i = 0; i < validTypes.length; i++) {
        for (let j = 0; j < trashKeys.length; j++) {
            const trash = (validTypes[i] + trashKeys[j]);
            if (trash in fImage) delete fImage[trash];
        }
    }
    return fImage;
};

const formatEvent = (event) => {
    const fEvent = event.toJSON();
    if ("EventImages" in fEvent) {
        const previewImage = extractPreviewImageURL(fEvent.EventImages, "event");
        fEvent.previewImage = previewImage;
        delete fEvent.EventImages;
    }
    if ("Attendees" in fEvent) {
        const numAttending = fEvent.Attendees.length;
        fEvent.numAttending = numAttending;
        delete fEvent.Attendees;
    }
    if ("startDate" in fEvent) {
        fEvent.startDate = formatDate(fEvent.startDate);
    }
    if ("endDate" in fEvent) {
        fEvent.endDate = formatDate(fEvent.endDate);
    }
    if ("createdAt" in fEvent) {
        fEvent.createdAt = formatDate(fEvent.createdAt);
    }
    if ("updatedAt" in fEvent) {
        fEvent.updatedAt = formatDate(fEvent.updatedAt);
    }

    return fEvent;
};

// takes in an object and an array of strings and removes
// all keys except for those specified by the array.
const removeKeysExcept = (obj, keyArr) => {
    Object.keys(obj).forEach((key) => {
        if (!keyArr.includes(key)) {
            delete obj[key];
        }
    });
};

// takes in a userId and a group and returns a boolean indicating
// whether or not the user is the organizer of the group.
const isGroupOrganizer = (userId, group) => {
    return (Number(userId) === Number(group.organizerId));
};

const hasValidStatus = (userId, objArr, validStatus) => {
    let vStatus = false;
    userId = Number(userId);
    objArr.forEach((obj) => {
        const currentStat = obj.status;
        const currentUId = Number(obj.userId);

        if ((userId === currentUId) && validStatus.includes(currentStat)) {
            vStatus = true;
        }
    });
    return vStatus;
};

const determineStatus = (userId, objArr) => {
    let status = null;
    objArr.forEach((obj) => {
        let objStatus = null;
        const currentUId = obj.userId;
        if ("status" in obj) {
            objStatus = obj.status;
        } else if ("Membership" in obj) {
            objStatus = obj.Membership.status;
        } else if ("Attendance" in obj) {
            objStatus = obj.Attendance.status;
        }

        if (objStatus && (Number(currentUId) === Number(userId))) {
            status = objStatus;
        }
    });
    return status;
};

const instanceNotFound = (modelName) => {
    return {
        "message": `${modelName} couldn't be found`,
        "statusCode": 404
      }
};

const deleteImage = async (imageId, userId, imageType) => {
    const image = await Image.findByPk(imageId);
    const validImageTypes = ["group", "event"];
    const validMemStat = ["co-host"];
    let group = null;
    let event = null;

    if (image) {
        const { groupId, eventId, url } = image;
        if (imageType === validImageTypes[0]) {
            group = await Group.findByPk(groupId, {
                include: ["Members"]
            });
        } else if (imageType === validImageTypes[1]) {
            event = await Event.findByPk(eventId, {
                include: ["Attendees", {
                    model: Group, include: ["Members"]
                }]
            });
            group = event.Group;
        }
        const members = group.members;
        const organizer = isGroupOrganizer(userId, group);
        const memStat = determineStatus(userId, members);

        if (validMemStat.includes(memStat) || organizer) {
            image[imageType + "Preview"] = false;
            image[imageType + "Id"] = null;
            await image.save();

            const targetRemains = await Image.findByPk(imageId);

            if (targetRemains) {
                return { Image: targetRemains };
            } else {
                return {
                    "message": "Successfully deleted",
                    "statusCode": 200
                  };
            }

        } else {
            return defaultUnauthorized;
        }
    } else {
        return {
            "message": `${imageType.slice(0, 1).toUpperCase()
                        + imageType.slice(1)} Image couldn't be found`,
            "statusCode": 404
          }
    }
};

module.exports = { extractPreviewImageURL, formatDate,
    formatGroup, formatImage, formatEvent,
    isGroupOrganizer, hasValidStatus, instanceNotFound,
    removeKeysExcept, determineStatus, deleteImage
 };
