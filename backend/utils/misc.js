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

module.exports = { extractPreviewImageURL, formatDate, formatGroup, formatImage };
