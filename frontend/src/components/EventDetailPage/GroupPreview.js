import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";

const GroupPreview = ({ group }) => {
    return (
        <NavLink to={`/groups/${group.id}`}>
            <div className="group-preview">
                <div className="group-preview-image">
                    <img src={group.previewImage} alt="group-preview-image"></img>
                </div>
                <div className="info">
                    <p className="group-name">{group.name}</p>
                    <p className="is-private">{group.private? "Private" : "Public"}</p>
                </div>
            </div>
        </NavLink>
    );
};

export default GroupPreview;
