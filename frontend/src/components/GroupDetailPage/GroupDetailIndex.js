import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { getGroupDetails } from "../../store/groupDetails";
import { getAllEvents } from "../../store/events";
import GroupDeleteModal from "../GroupDelete";

const GroupDetailPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const groupId = Number(useParams().groupId);

    const [currentUser, setCurrentUser] = useState({});
    const [group, setGroup] = useState({});
    const [organizer, setOrganizer] = useState({});
    const [events, setEvents] = useState({});


    const loadCurrentUser = useSelector((state) =>{
        return state.session.user;
    });
    const loadGroup = useSelector((state) => {
        return state.groupDetails;
    });
    const loadOrganizer = useSelector((state) => {
        return state.organizer;
    });
    const loadEvents = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(getGroupDetails(groupId));
    }, [dispatch, groupId]);

    useEffect(() => {
        setCurrentUser(loadCurrentUser);
        setGroup(loadGroup);
        setOrganizer(loadOrganizer);
    }, [loadCurrentUser, loadGroup, loadOrganizer]);

    useEffect(() => {
        if (!loadEvents.allIds.length) {
            dispatch(getAllEvents());
        }
        setEvents(loadEvents);
    }, [dispatch, loadEvents]);

    const groupEvents = [];
    if (events.allIds) {
        events.allIds.forEach((eventId) => {
            if (events[eventId].groupId === groupId) {
                groupEvents.push({...events[eventId]});
            }
        });
    }

    let numGroupEvents = `${groupEvents.length} event`;
    if (groupEvents.length !== 1) {
        numGroupEvents += 's';
    }

    if (!Object.keys(group).length) return null;

    const images = group.GroupImages;
    const venues = group.Venues;
    const authorized = (currentUser && (currentUser.id === organizer.id));
    const previewImage = group.previewImage;

    const joinGroupButton = <button onClick={() => window.alert("feature coming soon")}>Join this group</button>;
    const organizerButtons = (
        <div className="organizer-buttons">
            <button onClick={() => history.push(`/groups/${groupId}/events/new`)}>Create event</button>
            <button onClick={() => history.push(`/groups/${groupId}/edit`)}>Update</button>
            <GroupDeleteModal />
        </div>
    );

    return (
        <Fragment>
            <div className="breadcrumb">
                &lt;
                <NavLink to="/groups">{"Groups"}</NavLink>
            </div>
            <div className="group-detail-top">
                <div className="group-image">
                    <img src={previewImage} alt="group-preview-image" />
                </div>
                <h2>{group.name}</h2>
                <h3>{`Location: ${group.city}, ${group.state}`}</h3>
                <div className="group-events-public">
                        <p>{numGroupEvents + " · " + (group.private? "Private" : "Public")}</p>
                </div>
                <p>{`Organized by ${organizer.firstName} ${organizer.lastName}`}</p>
                {authorized ? organizerButtons : joinGroupButton}
            </div>
            <div className="group-detail-middle">
                <h2>Organizer</h2>
                <p>{`${organizer.firstName} ${organizer.lastName}`}</p>
                <h2>What we're about</h2>
                <p>{group.about}</p>
            </div>
        </Fragment>
    );
};

export default GroupDetailPage;
