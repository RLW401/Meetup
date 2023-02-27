import React, { Fragment, useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

const ProfileButton = ({ user }) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef(null);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("click", closeMenu);
    }

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = ("profile-dropdown" + (showMenu ? "" : " hidden"));

    return (
      <Fragment>
        {/* <button style={{ color: "darkblue", fontSize: "100px" }}> */}
        <button onClick={openMenu}>
          <i className="fas fa-user-circle" />
        </button>

        <ul className={ulClassName} ref={ulRef}>
          <li>{user.username}</li>
          <li>{user.firstName} {user.lastName}</li>
          <li>{user.email}</li>
          <li>
            <button onClick={logout}>Log Out</button>
          </li>
        </ul>
      </Fragment>
    );
};

export default ProfileButton;
