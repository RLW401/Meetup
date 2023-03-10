import { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { createEvent } from '../../store/events';
import { appendImage } from '../../store/images';
import { deleteImage } from '../../store/images';
import getImages from '../../utils/getImages';

const imageType = "event";

const EventForm = ({ event, formType, group }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const [name, setName] = useState(event.name);
    const [type, setType] = useState(event.type);
    const [capacity, setCapacity] = useState(event.capacity);
    const [price, setPrice] = useState(event.price);
    const [description, setDescription] = useState(event.description);
    const [startDate, setStartDate] = useState(event.startDate);
    const [endDate, setEndDate] = useState(event.endDate);
    const [imageUrl, setImageUrl] = useState('');

    let eventFormHeader = null;

    if (formType === "Create Event") {
        eventFormHeader = (<h2>{`Create an event for ${group.name}`}</h2>);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        event = {...event, name, type, capacity, price,
            description, startDate, endDate};

            if (formType === "Create Event") {
                const newEvent = await dispatch(createEvent(event, group.id));
                await dispatch(appendImage(imageUrl, imageType, newEvent.id));
                history.push(`/events/${newEvent.id}`);
            }
    };

    return (
        <form className='event' onSubmit={handleSubmit}>
            <div className='header'>
                {eventFormHeader}
            </div>
            <div className='form-body'>
                <div className='location'>
                    <p>What is the name of your event?</p>
                    <label>
                        <input
                        type='text'
                        value={name}
                        placeholder='Event Name'
                        onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                </div>
                <div className='basics'>
                    <div className='type'>
                    <p>Is this an in person or online event?</p>
                        <label>
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                <option disabled={true} value='' >(select one)</option>
                                <option value="In person">In Person</option>
                                <option value="Online">Online</option>
                            </select>
                        </label>
                    </div>
                    <div className='capacity'>
                        <p>How many people can your event accommodate?</p>
                        <label>
                            <input
                            type='number'
                            value={capacity}
                            placeholder='Event Capacity'
                            onChange={(e) => setCapacity(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className='price'>
                        <p>What is the price for your event?</p>
                        <label>
                            <input
                            type='number'
                            value={price}
                            placeholder={0}
                            onChange={(e) => setPrice(e.target.value)}
                            />
                        </label>
                    </div>
                </div>
                <div className='schedule'>
                    <div className='start'>
                        <label htmlFor="event-start">When does your event start?</label>
                        <input type="datetime-local" id="meeting-time"
                            name="event-start" value={startDate}
                            min="1300-06-07T00:00" max="2100-06-14T00:00"
                            onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className='end'>
                        <label htmlFor="event-end">When does your event end?</label>
                        <input type="datetime-local" id="meeting-time"
                            name="event-end" value={endDate}
                            min="1300-06-07T00:00" max="2100-06-14T00:00"
                            onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
                <div className='img-input'>
                    <p>Please add in image url for your event below: </p>
                    <label>
                        <input
                            type="text"
                            value={imageUrl}
                            placeholder="Image URL"
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    </label>
                </div>
                <div className='description'>
                    <p>Please describe your event: </p>
                    <label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Please include at least 30 characters'
                            rows={10}
                            cols={60}
                        />
                    </label>
                </div>
            </div>
            <div className='bottom'>
                <input type="submit" value={formType} />
            </div>
        </form>
    );
};

export default EventForm;
