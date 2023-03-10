import { csrfFetch } from "./csrf";
import { normalizeAll, normalizeDetail } from "../utils/normalization";

const prefix = "events/";
const LOAD = (prefix + "LOAD");
const DETAIL = (prefix + "DETAIL");
const ADD_EVENT = (prefix + "ADD_EVENT");
const REMOVE_EVENT = (prefix + "REMOVE_EVENT");

const load = (events) => ({
    type: LOAD,
    payload: events
});

const addEvent = (event) => ({
    type: ADD_EVENT,
    payload: event
});

const removeEvent = (eventId) => ({
    type: REMOVE_EVENT,
    eventId
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

export const createEvent = (eventData, groupId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/groups/${groupId}/events`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
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

        const newEvent = await response.json();

        dispatch(addEvent(newEvent));
        return newEvent;

    } catch (error) {
        throw error;
    }
};

export const deleteEvent = (eventId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/events/${eventId}`, {
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
        dispatch(removeEvent(eventId));
        return deleteMessage;
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
        case DETAIL:
            const normalizedEventDetails = normalizeDetail(action.payload);
            return { ...state, ...normalizedEventDetails};
        case ADD_EVENT:
            return {
                ...state,
                [action.payload.id]: {...action.payload},
                allIds: [...state.allIds, action.payload.id]
            };
        case REMOVE_EVENT:
            const stateMinusEvent = {...state};
            const newIds = [];
            state.allIds.forEach((id) => {
                if (id !== action.eventId) newIds.push(id);
            });

            delete stateMinusEvent[action.eventId];

            return {...stateMinusEvent, allIds: newIds};
        default:
            return state
    }
};

export default eventReducer;
