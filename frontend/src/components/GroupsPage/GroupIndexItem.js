import React from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const GroupIndexItem = ({ group }) => {
    const groupId = group.id;
    const history = useHistory();

    return (
        <li>
            <div className='group-index-item'>
                <NavLink key={groupId} to={`/groups/${groupId}`}>
                    <div className='group-image'>
                        <img src={group.previewImage} alt="group-preview-image" />
                    </div>
                    <h2>{group.name}</h2>
                    <h3>{`Location: ${group.city}, ${group.state}`}</h3>
                    <p className="group-description">{group.about}</p>
                </NavLink>
                <div className="group-events-public">
                        <NavLink to={`/groups/${groupId}/events`}>## events</NavLink>
                        {/* <p onClick={() => history.push(`/groups/${groupId}/events`)}>## events</p> */}
                        <p>{group.private? " · Private" : " · Public"}</p>
                </div>
            </div>
        </li>
        );
};

export default GroupIndexItem;
