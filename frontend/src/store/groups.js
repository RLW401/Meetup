import { csrfFetch } from "./csrf";
import { normalizeAll } from "../utils/normalization";
import { REMOVE_IMAGE } from "./images";

const groupActionPrefix = "groups/";
const LOAD = groupActionPrefix + "LOAD";
const DETAIL = groupActionPrefix + "DETAIL";
const ADD_GROUP = groupActionPrefix + "ADD_GROUP";
const UPDATE_GROUP = groupActionPrefix + "UPDATE_GROUP";
const REMOVE_GROUP = groupActionPrefix + "REMOVE_GROUP";
const ADD_GROUP_IMAGE = groupActionPrefix + "ADD_GROUP_IMAGE";
const REMOVE_GROUP_IMAGE = groupActionPrefix + "REMOVE_GROUP_IMAGE";
const groupImageType = "group";

const load = (groups) => ({
    type: LOAD,
    payload: groups
});

const detail = (group) => ({
    type: DETAIL,
    payload: group
});

const addGroup = (group) => ({
    type: ADD_GROUP,
    payload: group
});

const updateGroup = (group) => ({
    type: UPDATE_GROUP,
    payload: group
});

const removeGroup = (groupId) => ({
    type: REMOVE_GROUP,
    groupId
});

const addGroupImage = (groupId, img) => ({
    type: ADD_GROUP_IMAGE,
    payload: { groupId, img }
});

export const getAllGroups = () => async (dispatch) => {
    try {
        const response = await fetch("/api/groups");
        if (response.ok) {
            // all groups returned in an object with a single
            // key "Groups" whose value is an array
            const groupsObj = await response.json();
            dispatch(load(groupsObj));
            return groupsObj;
        }
    } catch (error) {
        throw error;
    }
};

export const getGroupDetails = (groupId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/groups/${groupId}`);
        if (response.ok) {
            const detailedGroup = await response.json();
            dispatch(detail(detailedGroup));
            return detailedGroup;
        }
    } catch (error) {
        throw error;
    }
};

export const createGroup = (groupData) => async (dispatch) => {
    try {
        const response = await csrfFetch("/api/groups", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(groupData)
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

        const newGroup = await response.json();

        dispatch(addGroup(newGroup));
        return newGroup;

    } catch (error) {
        throw error;
    }
};

export const editGroup = (groupData) => async (dispatch) => {
    try {
        const groupId = groupData.id;
        const response = await csrfFetch(`/api/groups/${groupId}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(groupData)
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

        const changedGroup = await response.json();
        dispatch(updateGroup(changedGroup));
        return changedGroup;

    } catch (error) {
        throw error;
    }
};

export const deleteGroup = (groupId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/groups/${groupId}`, {
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
        dispatch(removeGroup(groupId));
        return deleteMessage;
    } catch (error) {
        throw error;
    }
};

export const groupImageAdd = (url, groupId, isPreview = true) => async (dispatch) => {
    const imgData = { url, preview: isPreview };
    try {
        const response = await csrfFetch(`/api/groups/${groupId}/images`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(imgData)
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

        const newImg = await response.json();
        dispatch(addGroupImage(groupId, newImg));

    } catch (error) {
        throw error;
    }
};

// export const groupImageDelete

const initialState = {
    allIds: [],
    groupDetails: {}
};

const groupReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD:
            const normalizedGroups = normalizeAll(action.payload);
            const allGroups = normalizedGroups[0];
            const allIds = normalizedGroups[1];
            return {...state, ...allGroups, allIds};

        case DETAIL:
            return {...state, groupDetails: {...action.payload}};

        case ADD_GROUP:
            const groupId = action.payload.id;
            return {...state, [groupId]: {...action.payload}, allIds: [...state.allIds, groupId]};

        case UPDATE_GROUP:
            return {...state, [action.payload.id]: {...action.payload}};

        case REMOVE_GROUP:
            const stateMinusGroup = {...state};
            const newIds = [];
            state.allIds.forEach((id) => {
                if (id !== action.groupId) newIds.push(id);
            });

            delete stateMinusGroup[action.groupId];

            return {...stateMinusGroup, allIds: newIds};

        case ADD_GROUP_IMAGE:
            const newImageState = {
                ...state,
                [action.payload.groupId]: {
                    ...state[action.payload.groupId],
                    previewImage: action.payload.img.url
                }
            }
            return newImageState;
        case REMOVE_IMAGE:
            if ((action.payload.imageType === groupImageType)
                && (state.groupDetails.id === action.payload.objId)) {
                const removeImgState = { ...state };
                const removeImageArr = [];
                let previewImage = "No preview image";
                state.groupDetails.GroupImages.forEach((img) => {
                    if (img.id !== action.payload.imageId) {
                        removeImageArr.push(img);
                        if (img.preview) previewImage = img.url;
                    }
                });
                // if the group the image belonged to has already been
                // loaded into state
                if (state[action.payload.objId]) {
                    // update its preview image value
                    removeImgState[action.payload.objId] = {
                        ...removeImgState[action.payload.objId],
                        previewImage
                    };
                }
                removeImgState.groupDetails = {
                    ...removeImgState.groupDetails,
                    GroupImages: removeImageArr
                };
                return removeImgState;
            }
        default:
            return state;
    }
};

export default groupReducer;
