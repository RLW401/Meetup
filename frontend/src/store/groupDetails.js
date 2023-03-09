import { normalizeDetail } from "../utils/normalization";
import { REMOVE_IMAGE } from "./images";

const prefix = "groupDetails/";
const GET_DETAILS = (prefix + "GET_DETAILS");

const detail = (group) => ({
    type: GET_DETAILS,
    payload: group
});

export const getGroupDetails = (groupId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/groups/${groupId}`);
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
        const detailedGroup = await response.json();
        dispatch(detail(detailedGroup));
        return detailedGroup;
    } catch (error) {
        throw error;
    }
};

const initialState = {};

const groupDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DETAILS:
            const normalizedGroupDetails = normalizeDetail(action.payload);
            return { ...normalizedGroupDetails };
        case REMOVE_IMAGE:
            if ((action.payload.imageType === "group")
                && (state.id === action.payload.objId)) {
                const removeImageArr = [];
                let previewImage = "No preview image";
                state.GroupImages.forEach((img) => {
                    if (img.id !== action.payload.imageId) {
                        removeImageArr.push(img);
                        if (img.preview) previewImage = img.url;
                    }
                });
                return {...state, previewImage, GroupImages: removeImageArr};
            }
        default:
            return state;
    }
};

export default groupDetailReducer;
