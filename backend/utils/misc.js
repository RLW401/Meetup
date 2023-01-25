// backend/utils/misc.js

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

    if (formattedGroup.createdAt) {
        formattedGroup.createdAt = formatDate(formattedGroup.createdAt);
    }
    if (formattedGroup.updatedAt) {
        formattedGroup.updatedAt = formatDate(formattedGroup.updatedAt);
    }

    if (formattedGroup.Memberships) {
        formattedGroup.numMembers = formattedGroup.Memberships.length;
        delete formattedGroup.Memberships;
    }

    if (formattedGroup.Images) {
        formattedGroup.previewImage = extractPreviewImageURL(formattedGroup.Images, "group");
        delete formattedGroup.Images;
    }

    return formattedGroup;
};

module.exports = { extractPreviewImageURL, formatDate, formatGroup };