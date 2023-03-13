import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { getGroupDetails } from "../../store/groupDetails";
import { getAllEvents } from "../../store/events";
import GroupDeleteModal from "../GroupDelete";
import EventIndexItem from "../EventsPage/EventIndexItem";

const GroupDetailPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const groupId = Number(useParams().groupId);

    const [currentUser, setCurrentUser] = useState({});
    const [group, setGroup] = useState({});
    const [organizer, setOrganizer] = useState({});
    const [events, setEvents] = useState({});
    // const [currentDate, setCurrentDate] = useState(new Date());


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


    // remember to change current date to present
    useEffect(() => {
        if (!loadEvents.allIds.length) {
            dispatch(getAllEvents());
        }
        setEvents(loadEvents);
        // setCurrentDate(new Date(1350-10-15));
    }, [dispatch, loadEvents]);

    const pastEvents = [];
    const futureEvents = [];
    if (events.allIds) {
        const currentDate = new Date();
        console.log("currentDate: ", currentDate);
        events.allIds.forEach((eventId) => {
            if (events[eventId].groupId === groupId) {
                if (new Date(events[eventId].startDate) > currentDate) {
                    futureEvents.push({ ...events[eventId] });
                } else {
                    pastEvents.push({ ...events[eventId] });
                }
            }
        });
        pastEvents.sort((a, b) => {
            if (new Date(a.startDate) < new Date(b.startDate)) return 1;
            return -1;
        });
        futureEvents.sort((a, b) => {
            if (new Date(a.startDate) < new Date(b.startDate)) return -1;
            return 1;
        });
    }

    let numGroupEvents = `${(pastEvents.length + futureEvents.length)} event`;
    if ((pastEvents.length + futureEvents.length) !== 1) {
        numGroupEvents += 's';
    }

    if (!Object.keys(group).length) return null;

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

    let groupEvents = (
        <div className="group-events">
            <h2>No Upcoming Events</h2>
        </div>
    );
    let futureGroupEvents = null;
    let pastGroupEvents = null;

    if (futureEvents.length) {
        futureGroupEvents = (
            <div className="upcoming-events">
                <h2>{`Upcoming Events (${futureEvents.length})`}</h2>
                <ul className="upcoming-events">
                    {futureEvents.map((event) => {
                        return <EventIndexItem key={event.id} event={event}/>
                        })}
                </ul>
            </div>
        );
    }
    if (pastEvents.length) {
        pastGroupEvents = (
            <div className="past-events">
                <h2>{`Past Events (${pastEvents.length})`}</h2>
                <ul className="past-events">
                    {pastEvents.map((event) => {
                        return <EventIndexItem key={event.id} event={event}/>
                        })}
                </ul>
            </div>
        );
    }

    if (futureGroupEvents || pastGroupEvents) {
        groupEvents = (
            <div className="group-events">
                {futureGroupEvents}
                {pastGroupEvents}
            </div>
        );
    }

    return (
        <div className="container">
            <div className="breadcrumb">
                &lt;
                <NavLink to="/groups">{"Groups"}</NavLink>
            </div>
            <div className="group-detail body">
                <div className="group-detail top">
                    <div className="group-image-container">
                        <img src={previewImage} alt="group-preview" />
                    </div>
                    <h2>{group.name}</h2>
                    <h3>{`Location: ${group.city}, ${group.state}`}</h3>
                    <div className="group-events-public">
                            <p>{numGroupEvents + " · " + (group.private? "Private" : "Public")}</p>
                    </div>
                    <p>{`Organized by ${organizer.firstName} ${organizer.lastName}`}</p>
                    {authorized ? organizerButtons : joinGroupButton}
                </div>
                <div className="group-detail middle">
                    <h2>Organizer</h2>
                    <p>{`${organizer.firstName} ${organizer.lastName}`}</p>
                    <h2>What we're about</h2>
                    <p>{group.about}</p>
                </div>
                {groupEvents}
            </div>
        </div>
    );
};

export default GroupDetailPage;
