import { csrfFetch } from "./csrf";

const imageActionPrefix = "images/";
export const ADD_IMAGE = imageActionPrefix + "ADD_IMAGE";
export const REMOVE_IMAGE = imageActionPrefix + "REMOVE_IMAGE";

const removeImage = (imageId, imageType, objId) => ({
    type: REMOVE_IMAGE,
    payload: { imageId, imageType, objId }
});

export const deleteImage = (imageId, imageType, objId) => async (dispatch) => {
    imageType = imageType.toLowerCase();
    imageId = Number(imageId);
    objId = Number(objId);
    const url = `/api/${imageType}-images/${imageId}`;
    try {
        const response = await csrfFetch(url, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const error = await response.text();
            let errorJSON;
            try {
                // check to see if error is JSON
                errorJSON = JSON.parse(error);
            } catch {
                // error was not from server
                throw new Error(error);
            }
            throw new Error(`${errorJSON.title}: ${errorJSON.message}`);
        }
        const deleteMessage = await response.json();
        dispatch(removeImage(imageId, imageType, objId));
        return deleteMessage;
    } catch (error) {
        throw error;
    }
};
