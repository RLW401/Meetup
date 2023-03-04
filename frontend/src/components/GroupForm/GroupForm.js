import { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { createGroup } from '../../store/groups';

const GroupForm = ({ group, formType }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const [name, setName] = useState(group.name);
    const [about, setAbout] = useState(group.about);
    const [type, setType] = useState(group.type);
    const [isPrivate, setIsPrivate] = useState(group.private);
    const [location, setLocation] = useState('');

    const formIntroStart = "We'll walk you through a few steps to";

    useEffect(() => {
        if (group.city && group.state) {
            setLocation(`${group.city}, ${group.state}`);
        }
    });

    let groupFormHeader = null;

    if (formType === "Create group") {
        groupFormHeader = (
            <Fragment>
                <h4>BECOME AN ORGANIZER</h4>
                <h2>{`${formIntroStart} build your local community`}</h2>
            </Fragment>
        );
    } else if (formType === "Update group") {
        groupFormHeader = (
            <Fragment>
                <h4>UPDATE YOUR GROUP'S INFORMATION</h4>
                <h2>{`${formIntroStart} update your group's information`}</h2>
            </Fragment>
        );
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const cityState = location.split(", ");
        const city = cityState[0];
        const state = cityState[1];

        group = {...group, name, about, type,
                private: isPrivate, city, state};

        if (formType === "Create group") {
            const createdGroup = await dispatch(createGroup(group));
            history.push(`/groups/${createdGroup.id}`);
            // history.push(`/`);
        } else if (formType === "Update group") {
            console.log("Update group not yet implemented");
            return null;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='group-form header'>
                {groupFormHeader}
            </div>
            <div className='group-form location'>
                <h2>First, set your group's location.</h2>
                <p>Meetup groups meet locally, in person and online.
                    We'll connect you with people in your area, and
                    more can join you online.</p>
                <label>
                    <input
                    type='text'
                    value={location}
                    placeholder='City, STATE'
                    onChange={(e) => setLocation(e.target.value)} />

                </label>
            </div>
            <div className='group-form name'>
                <h2>What will your group's name be?</h2>
                <p>Choose a name that will give people a clear idea
                    of what the group is about. Feel free to get
                    creative! You can edit this later if you change
                    your mind.</p>
                <label>
                    <input
                        placeholder='What is your group name?'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                </label>
            </div>
            <div className='group-form about'>
                <h2>Now describe what your group will be about</h2>
                <p>People will see this when we promote your group,
                    but you'll be able to add to it later, too.</p>
                    <ol>
                        <li>
                            <p>What's the purpose of the group?</p>
                        </li>
                        <li>
                            <p>Who should join?</p>
                        </li>
                        <li>
                            <p>What will you do at your events?</p>
                        </li>
                    </ol>
                    <label>
                        <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            placeholder='Please write at least 30 characters'
                            rows={10}
                            cols={60}
                        />
                    </label>
            </div>
            <div className='group-form final-steps'>
                <h2>Final steps...</h2>
                <p>Is this an in person or online group?</p>
                <label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option disabled={true} value='' >(choose one)</option>
                        <option value="In person">In Person</option>
                        <option value="Online">Online</option>
                    </select>
                </label>
                <p>Is this group private or public?</p>
                <label>
                    <select value={isPrivate} onChange={(e) => setIsPrivate(e.target.value)}>
                        <option disabled={true} value='' >(choose one)</option>
                        <option value={true}>Private</option>
                        <option value={false}>Public</option>
                    </select>
                </label>
            </div>
            <input type="submit" value={formType} />
        </form>
    );
};

export default GroupForm;