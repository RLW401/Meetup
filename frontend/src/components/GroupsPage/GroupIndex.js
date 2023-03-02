import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';

import { getAllGroups } from "../../store/groups";
import GroupIndexItem from "./GroupIndexItem";

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
                <NavLink to="/events">Events </NavLink>
                <NavLink to="/groups"> Groups</NavLink>
            </div>
            <ul>
                {gPage}
            </ul>
        </Fragment>
        );
};

export default GroupsPage;
