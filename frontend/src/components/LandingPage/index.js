import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';

const LandingPage = () => {
    return (
        <Fragment>
            <NavLink to="/groups">See all groups</NavLink>
            <NavLink to="/events">Find an event</NavLink>
            <NavLink to="/groups/new">Start a new group</NavLink>
        </Fragment>
    );
};

export default LandingPage;
