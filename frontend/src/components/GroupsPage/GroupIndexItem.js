import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { getAllEvents } from '../../store/events';

const GroupIndexItem = ({ group }) => {
    const dispatch = useDispatch();
    const groupId = group.id;
    const history = useHistory();
    const [events, setEvents] = useState({});

    const loadEvents = useSelector((state) => state.events);

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
    return (
        <li>
            <div className='group-index-item'>
                <NavLink key={groupId} to={`/groups/${groupId}`}>
                    <div className='image'>
                        <img src={group.previewImage} alt="group-preview" />
                    </div>
                    <h2>{group.name}</h2>
                    <h3>{`Location: ${group.city}, ${group.state}`}</h3>
                    <p className="group-description">{group.about}</p>
                    <div className="group-events-public">
                            <p>{numGroupEvents + " · " + (group.private? "Private" : "Public")}</p>
                    </div>
                </NavLink>
            </div>
        </li>
        );
};

export default GroupIndexItem;
