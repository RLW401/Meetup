import { GET_DETAILS } from "./groupDetails";

const initialState = {};

const organizerReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_DETAILS:
            return { ...action.payload.Organizer };
        default:
            return state;
    }
};

export default organizerReducer;
