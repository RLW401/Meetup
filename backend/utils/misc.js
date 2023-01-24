// backend/utils/misc.js

// takes in an array of image json objects and
// returns the url of an event preview image
const extractEventPreviewImageURL = (images) => {
    let previewImage = "No preview image";
    images.forEach((image) => {
        if (image.eventPreview) {
            previewImage = image.url;
        }
    });
    return previewImage;
};

module.exports = { extractEventPreviewImageURL };
