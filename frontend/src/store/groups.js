import { normalizeAll } from "../utils/normalization";

const LOAD = "groups/LOAD";
const DETAIL = "groups/DETAIL";

const load = (groups) => ({
    type: LOAD,
    payload: groups
});

const detail = (group) => ({
    type: DETAIL,
    payload: group
});

export const getAllGroups = () => async (dispatch) => {
    const response = await fetch("/api/groups");
    if (response.ok) {
        // all groups returned in an object with a single
        // key "Groups" whose value is an array
        const groupsObj = await response.json();
        dispatch(load(groupsObj));
        return groupsObj;
    }
};

export const getGroupDetails = (groupId) => async (dispatch) => {
    const response = await fetch(`/api/groups/${groupId}`);

    if (response.ok) {
        const detailedGroup = await response.json();
        dispatch(detail(detailedGroup));
        return detailedGroup;
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
            return {...state, groupDetails: {...action.payload}}
        default:
            return state;
    }
};

export default groupReducer;
