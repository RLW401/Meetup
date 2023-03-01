import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';

import { getAllGroups } from "../../store/groups";

const GroupsPage = () => {
    const dispatch = useDispatch();
    const groups = useSelector((state) => {
        return state.groups;
    });

    useEffect(() => {
        dispatch(getAllGroups());
    }, [dispatch]);

    if (!groups) return <h1>no groups</h1>

    let gPage;

    if (groups) {
        gPage = groups.map((group) => (
            <NavLink key={group.id} to={`/groups/${group.id}`}>
                <h2>{group.name}</h2>
                <h3>{`Location: ${group.city}, ${group.state}`}</h3>
                <p className="group-description">{group.about}</p>
                <div className="group-events-public">
                    <NavLink to={`/groups/${group.id}/events`}>## events</NavLink>
                    <p>{group.private? "Private" : "Public"}</p>
                </div>
            </NavLink>)
        )
    }

    return gPage;
};

export default GroupsPage;
