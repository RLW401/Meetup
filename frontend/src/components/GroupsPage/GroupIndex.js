import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';

import { getAllGroups } from "../../store/groups";
import GroupIndexItem from "./GroupIndexItem";

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
        gPage = Object.values(groups).map((group) => (
            <GroupIndexItem group={group} key={group.id} />

        ));
    }

    return (
        <ul>
            {gPage}
        </ul>
        );
};

export default GroupsPage;
