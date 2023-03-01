const LOAD = "groups/LOAD";

const load = (groups) => ({
    type: LOAD,
    payload: groups
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

const initialState = [];

const groupReducer = (state = initialState, action) => {
    const newState = [ ...state ];
    switch (action.type) {
        case LOAD:
            // action.payload.forEach((group) => newState[group.id] = group);
            // newState.groups = action.payload;
            // console.log("action in group reducer: ", action);
            // console.log("newState in group reducer: ", newState);
            return [...action.payload];
        default:
        return newState;
    }
};

export default groupReducer;
