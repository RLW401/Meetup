import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';

import { getAllEvents } from "../../store/events";
import EventIndexItem from "./EventIndexItem";
import sortEvents from "../../utils/sortEvents";

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

    let sortedEvents = sortEvents({ ...eventState, allIds: [...eventState.allIds] });
    const pastEvents = sortedEvents[0];
    const futureEvents = sortedEvents[1];
    sortedEvents = [...futureEvents, ...pastEvents];

    // let ePage;

    // if (eventState.allIds) {
    //     ePage = eventState.allIds.map((eventId) => {
    //         return <EventIndexItem key={eventId} event={eventState[eventId]}/>
    //     });
    // }

    const ePage = sortedEvents.map((event) => {
        return <EventIndexItem key={event.id} event={event}/>
    });

    return (
        <div className="event-page container">
            <div className="event-page header">
                <h4>Events in Meetup</h4>
                <div className="event-group-links">
                    <NavLink to="/events">Events </NavLink>
                    <NavLink to="/groups"> Groups</NavLink>
                </div>
            </div>
            <ul>
                {ePage}
            </ul>
        </div>
    );
};

export default EventsPage;
