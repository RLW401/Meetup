import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { getEventDetails } from "../../store/eventDetails";
import GroupPreview from "./GroupPreview";

const EventDetailPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const eventId = Number(useParams().eventId);

    useEffect(() => {
        dispatch(getEventDetails(eventId));
    }, [dispatch, eventId]);

    const event = useSelector((state) => {
        return state.eventDetails;
    });
    const group = useSelector((state) => {
        return state.groupDetails;
    });

    const groupId = event.groupId;

    const currentUser = useSelector((state) =>{
        return state.session.user;
    });

    if (!Object.keys(event).length) return null;

    const organizer = group.Organizer;
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
