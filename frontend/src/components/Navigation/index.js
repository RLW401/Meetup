import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';

const Navigation = ({ isLoaded }) => {
    const sessionUser = useSelector((state) => state.session.user);

    const homeLink = (
      <NavLink exact to="/">
        <img
        src="https://res.cloudinary.com/dqswruico/image/upload/v1678648030/initial_meetup_seeder/Meetup_logo_lkoc70.png"
        className='logo'
        >
        </img>
      </NavLink>
    );

    let sessionLinks;
    if (sessionUser) {
      sessionLinks = (
        <div className='session-links'>
          <div className='profile-button'>
          <ProfileButton user={sessionUser} />
          </div>
          <div className='start-group link'>
            <NavLink to="/groups/new">Start a new group</NavLink>
          </div>
        </div>
      );
    } else {
      sessionLinks = (
        <div className='session-links'>

          <LoginFormModal />
          <NavLink to="/signup">Sign Up</NavLink>
        </div>
      );
    }

    const topBar = (
      <div className='top-bar'>
        {homeLink}
        {sessionLinks}
      </div>
    );

    // return (
    //   <ul>
    //     <li>
    //       {(isLoaded && sessionLinks)}
    //     </li>
    //   </ul>
    // );
    return (
      <Fragment>
        {(isLoaded && topBar)}
      </Fragment>
    );
};

export default Navigation;
