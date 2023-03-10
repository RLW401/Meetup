import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { getEventDetails } from "../../store/eventDetails";
import { getGroupDetails } from "../../store/groupDetails";
import GroupPreview from "./GroupPreview";
import EventBasics from "./EventBasics";

const EventDetailPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const eventId = Number(useParams().eventId);

    const [currentUser, setCurrentUser] = useState({});
    const [event, setEvent] = useState({});
    const [group, setGroup] = useState({});
    const [organizer, setOrganizer] = useState({});

    const loadCurrentUser = useSelector((state) =>{
        return state.session.user;
    });
    const loadEvent = useSelector((state) => {
        return state.eventDetails;
    });
    const loadGroup = useSelector((state) => {
        return state.groupDetails;
    });
    const loadOrganizer = useSelector((state) => {
        return state.organizer;
    });

    useEffect(() => {
        dispatch(getEventDetails(eventId));
    }, [dispatch, eventId]);

    useEffect(() => {
        dispatch(getGroupDetails(event.groupId));
    }, [dispatch, event]);

    useEffect(() => {
        setCurrentUser(loadCurrentUser);
        setEvent(loadEvent);
        setGroup(loadGroup);
        setOrganizer(loadOrganizer);
    }, [loadCurrentUser, loadEvent, loadGroup, loadOrganizer]);







    const groupId = event.groupId;



    if (!Object.keys(event).length) return null;

    const images = event.EventImages;
    const venue = event.Venue;
    const authorized = (currentUser && (currentUser.id === organizer.id));
    const previewImage = event.previewImage;

    return (
        <Fragment>
            <div className="breadcrumb">
                <NavLink to="/events">{"< Events"}</NavLink>
            </div>
            <div className="event-detail-top">
                <h2>{event.name}</h2>
                <p>{`Hosted by ${organizer.firstName} ${organizer.lastName}`}</p>
            </div>
            <div className="event-detail-body">
                <div className="event-detail-display">
                    <div className="event-detail-image">
                        <img src={previewImage} alt="event-preview-image" />
                    </div>
                    <div className="event-detail-sidebar">
                        <div className="group-preview">
                            <GroupPreview group={group} />
                        </div>
                        <div className="event-basics">
                            <EventBasics event={event} authorized={authorized} />
                        </div>
                    </div>

                </div>
                <div className="event-detail-description">
                    <h3>Details</h3>
                    <p>{event.description}</p>
                </div>
            </div>
        </Fragment>
    );

};

export default EventDetailPage;
