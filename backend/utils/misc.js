// backend/utils/misc.js

const membership = require("../db/models/membership");

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

const formatMember = (member) => {
    const fMember = member.toJSON();
    if ("Membership" in fMember) {
        const Membership = fMember.Membership;

        Object.keys(Membership).forEach((key) => {
            if (key !== "status") {
                delete Membership[key];
            }
        });
    }
    return fMember;
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

module.exports = { extractPreviewImageURL, formatDate,
    formatGroup, formatImage, formatEvent,
    isGroupOrganizer, hasValidStatus, formatMember
 };
