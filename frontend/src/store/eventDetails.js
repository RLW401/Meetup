import { normalizeDetail } from "../utils/normalization";
import { ADD_IMAGE } from "./images";

const prefix = "eventDetails/";
const GET_DETAILS = (prefix + "GET_DETAILS");

const eventImageType = "event";


const detail = (event) => ({
    type: GET_DETAILS,
    payload: event
});

export const getEventDetails = (eventId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/events/${eventId}`);
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
        const detailedEvent = await response.json();
        const normalizedEventDetails = normalizeDetail(detailedEvent);
        dispatch(detail(normalizedEventDetails));
        return normalizedEventDetails;
    } catch (error) {
        throw error;
    }
};

const initialState = {};

const eventDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DETAILS:
            return { ...action.payload };
        case ADD_IMAGE:
            if ((action.payload.imageType === eventImageType)
                && (action.payload.objId === state.id)) {
                    const newImgArr = [...state.EventImages, action.payload.image];
                    return { ...state, EventImages: newImgArr };
                } else {
                    return state;
                }
        default:
            return state;
    }
};

export default eventDetailReducer;
