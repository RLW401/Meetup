import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { getEventDetails } from "../../store/events";
import { getGroupDetails } from "../../store/groups";

const EventDetailPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const eventId = Number(useParams().eventId);

    useEffect(() => {
        dispatch(getEventDetails(eventId));
    }, [dispatch, eventId]);

    const event = useSelector((state) => {
        return state.events.eventDetails;
    });

    const groupId = event.groupId;

    useEffect(() => {
        if (groupId) {
            dispatch(getGroupDetails(groupId));
        }
    }, [dispatch, groupId]);

    const group = useSelector((state) => {
        return state.groups.groupDetails;
    });

    const currentUser = useSelector((state) =>{
        return state.session.user;
    });

    if (!Object.keys(event).length) return null;

    return (<h2>Event Detail Page</h2>);


};

export default EventDetailPage;
