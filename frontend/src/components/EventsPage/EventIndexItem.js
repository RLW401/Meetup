import React from 'react';
import { NavLink } from 'react-router-dom';

const EventIndexItem = ({ event }) => {
    const eventId = event.id;
    let location;
    if (event.type === "Online") {
        location = event.type
    } else if (event.venueId ) {
        location = `${event.Venue.city}, ${event.Venue.state}`;
    } else if (event.Group) {
        location = `${event.Group.city}, ${event.Group.state}`;
    }

    return (
        <li>
            <div className='event-index-item'>
                <NavLink key={eventId} to={`/events/${eventId}`}>
                    <div className='top'>
                        <div className='image'>
                        <img src={event.previewImage} alt="event-preview" />
                        </div>
                        <div className='basic-info'>
                            <h3>{event.startDate}</h3>
                            <h2>{event.name}</h2>
                            <h3>{`Location: ${location}`}</h3>
                        </div>

                    </div>
                    <div className='bottom'>
                    <p className="event-description">{event.description}</p>
                    </div>

                </NavLink>
            </div>
        </li>
    );
};

export default EventIndexItem;
