import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from 'react-router-dom';

import { getGroupDetails } from "../../store/groups";

const GroupDetailPage = () => {
    const dispatch = useDispatch();
    const { groupId } = useParams();

    const group = useSelector((state) => {
        return state.groups.groupDetails;
    });

    useEffect(() => {
        dispatch(getGroupDetails(groupId));
    }, [dispatch]);

    if (!Object.keys(group).length) return null;

    const organizer = group.Organizer;
    const images = group.Images;
    const venues = group.Venues;

    return (
        <Fragment>
            <div className="group-detail-top">
                <div className="breadcrumb">
                    <NavLink to="/groups">{"< Groups"}</NavLink>
                </div>
                <h2>{group.name}</h2>
                <h3>{`Location: ${group.city}, ${group.state}`}</h3>
                <div className="group-events-public">
                        <NavLink to={`/groups/${groupId}/events`}>## events</NavLink>
                        {/* <p onClick={() => history.push(`/groups/${groupId}/events`)}>## events</p> */}
                        <p>{group.private? "Private" : "Public"}</p>
                </div>
                <p>{`Organized by ${organizer.firstName} ${organizer.lastName}`}</p>
                <button>Join this group</button>
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
