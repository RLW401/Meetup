import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';

import { getAllGroups } from "../../store/groups";
import GroupIndexItem from "./GroupIndexItem";
import "./groupIndex.css";

const GroupsPage = () => {
    const dispatch = useDispatch();
    const groupState = useSelector((state) => {
        return state.groups;
    });

    useEffect(() => {
        dispatch(getAllGroups());
    }, [dispatch]);

    if (!groupState.allIds.length) return <h1>no groups</h1>

    let gPage;

    if (groupState.allIds) {
        gPage = groupState.allIds.map((groupId) => {
            return <GroupIndexItem group={groupState[groupId]} key={groupId} />
        });
    }

    return (
        <Fragment>
            <div className="event-group-links">
                <NavLink className="events-on-groups" to="/events">Events </NavLink>
                <NavLink className="groups-on-groups" to="/groups"> Groups</NavLink>
            </div>
            <div className='all-groups'>
                {gPage}
            </div>
        </Fragment>
        );
};

export default GroupsPage;
