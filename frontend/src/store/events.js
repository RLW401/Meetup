import { normalizeAll } from "../utils/normalization";

const LOAD = "events/LOAD";
const DETAIL = "events/DETAIL";

const load = (events) => ({
    type: LOAD,
    payload: events
});

const detail = (event) => ({
    type: DETAIL,
    payload: event
});

export const getAllEvents = () => async (dispatch) => {
    try {
        const response = await fetch("/api/events");
        if (response.ok) {
            // all events returned in an object with a single
            // key "Events" whose value is an array
            const eventsObj = await response.json();
            dispatch(load(eventsObj));
            return eventsObj;
        }
    } catch (error) {
        throw error;
    }
};

const initialState = {
    allIds: [],
    eventDetails: {}
};

const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD:
            const normalizedEvents = normalizeAll(action.payload);
            const allEvents = normalizedEvents[0];
            const allIds = normalizedEvents[1];

            return {...state, ...allEvents, allIds};
        default:
            return state
    }
};

export default eventReducer;
