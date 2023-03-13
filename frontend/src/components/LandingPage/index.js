import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import "./landingPage.css";

const meetup_infographic = "https://res.cloudinary.com/dqswruico/image/upload/v1678727134/initial_meetup_seeder/Meetup_infoGraphic.png";
const joinGroupImg = "https://res.cloudinary.com/dqswruico/image/upload/v1678722219/initial_meetup_seeder/join_group_awuhi8.svg";
const findEventImg = "https://res.cloudinary.com/dqswruico/image/upload/v1678722218/initial_meetup_seeder/find_event_wpezis.svg";
const startGroupImg ="https://res.cloudinary.com/dqswruico/image/upload/v1678722273/initial_meetup_seeder/start_group_dp5kzj.svg";

const LandingPage = () => {
    const history = useHistory();
    const [currentUser, setCurrentUser] = useState({});

    const loadCurrentUser = useSelector((state) =>{
        return state.session.user;
    });
    useEffect(() => {
        setCurrentUser(loadCurrentUser);
    }, [loadCurrentUser]);

    const loggedIn = !!(currentUser);

    console.log("logged in: ", loggedIn);

    const disabledLink = (<p className='link-text-disabled'>Start a new group</p>);
    const enabledLink = (<NavLink to="/groups/new"
                         className="link-text"
                        >Start a new group</NavLink>);

    const joinButton = (<button
        className='join'
        onClick={() => history.push("/signup")}
        >
            Join Meetup
        </button>);
    return (
        <div className='container landing'>
            {/* <div className='sections-container'> */}

                <div className='section what-meetup'>
                    <div className='intro'>
                        <h2>The people platform—Where interests become friendships</h2>
                        <p>Meetup, one of the first websites, has been helping people connect since the 14th century. Whatever your interest, from hiking and reading to networking and witch hunting, there are thousands of people who share it on Meetup. Events are happening every day—log in to join the fun.</p>
                    </div>
                    <div className='infographic'>
                        <img src={meetup_infographic} alt="meetup-infographic"></img>
                    </div>
                </div>
                <div className='section how-works'>
                    <h2>How Meetup works</h2>
                    <p>{`Meet new people who share your interests through online and in-person events. Depending on the date of your event, Meetup may open a time-portal to the mid-14th century. It's free to create an account.`}</p>
                </div>
                <div className='section landing-links'>
                    <div className='landing-link see-groups'>
                        <img src={joinGroupImg} alt='see-groups'></img>
                        <NavLink
                        className="link-text"
                        to="/groups"
                        // activeClassName={loggedIn ? "active" : ""}
                        >See all groups</NavLink>
                        <p>Do what you love, meet others who love it, find your community. The rest is history!</p>
                    </div>
                    <div className='landing-link find-events'>
                        <img src={findEventImg} alt="find-events"></img>
                        <NavLink to="/events"
                        className="link-text"
                        // activeClassName="active"
                        >Find an event</NavLink>
                        <p>Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.</p>
                    </div>
                    <div className='landing-link start-group'>
                        <img src={startGroupImg} alt='start-group'></img>
                        {loggedIn ? enabledLink : disabledLink}


                        <p>You don't have to be an expert to gather people together and explore shared interests.</p>
                    </div>
                </div>
                <div className='section join'>
                    {joinButton}
                </div>
            {/* </div> */}



        </div>
    );
};

export default LandingPage;
