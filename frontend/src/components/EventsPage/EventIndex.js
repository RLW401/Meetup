import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';

import { getAllEvents } from "../../store/events";
import EventIndexItem from "./EventIndexItem";

const EventsPage = () => {
    const dispatch = useDispatch();
    const loadEventState = useSelector((state) => state.events);

    const [eventState, setEventState] = useState({});

    useEffect(() => {
        dispatch(getAllEvents());
    }, [dispatch]);

    useEffect(() => {
        setEventState(loadEventState);
    }, [loadEventState]);

    if ((!eventState.allIds || !eventState.allIds.length)) return <h1>no events</h1>

    let ePage;

    if (eventState.allIds) {
        ePage = eventState.allIds.map((eventId) => {
            return <EventIndexItem key={eventId} event={eventState[eventId]}/>
        });
    }

    return (
        <Fragment>
            <div className="event-group-links">
                <NavLink to="/events">Events </NavLink>
                <NavLink to="/groups"> Groups</NavLink>
            </div>
            <ul>
                {ePage}
            </ul>
        </Fragment>
        );
};

export default EventsPage;
