import { useSelector } from "react-redux";
import { csrfFetch } from "./csrf";
import { normalizeAll } from "../utils/normalization";

const LOAD = "groups/LOAD";
const DETAIL = "groups/DETAIL";
const ADD_GROUP = "groups/ADD_GROUP";
const UPDATE_GROUP = "groups/UPDATE_GROUP";
const REMOVE_GROUP = "REMOVE_GROUP";

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
            // const groupId = action.payload.id;
            // if (state.groups[groupId]) {
            //     console.log("group already exists: ", state.groups[groupId]);
            // } else {
            //     return {...state, ...action.payload}
            // }
        case UPDATE_GROUP:
            return {...state, [action.payload.id]: {...action.payload}};
        default:
            return state;
    }
};

export default groupReducer;
