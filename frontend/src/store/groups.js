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
        // extract array from object
        const groupsArr = groupsObj.Groups;
        dispatch(load(groupsArr));
        return groupsArr;
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

const makeGroupIdList = (groups) => {
    groups.sort((groupX, groupY) => {
        return (groupX.id - groupY.id);
    });
    const groupIdList = groups.map((group) => group.id);
    return groupIdList;
};

const initialState = {
    allIds: [],
    groupDetails: {}
};

const groupReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD:
            // action.payload.forEach((group) => newState[group.id] = group);
            // newState.groups = action.payload;
            // console.log("action in group reducer: ", action);
            // console.log("newState in group reducer: ", newState);
            const allIds = makeGroupIdList(action.payload);
            const allGroups = {};
            action.payload.forEach((group) => {
                allGroups[group.id] = group;
            });
            return {...state, ...allGroups, allIds};
        case DETAIL:
            return {...state, groupDetails: {...action.payload}}
        default:
        return {...state};
    }
};

export default groupReducer;
