import { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { createEvent } from '../../store/events';
import { appendImage } from '../../store/images';
import { deleteImage } from '../../store/images';
import getImages from '../../utils/getImages';
import { findErr } from '../../utils/errorHandling';
import './EventForm.css';

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

    useEffect(() => {
        const validationErrors = [];
        const urlComponents = imageUrl.split('.');
        const imgExt = urlComponents[urlComponents.length - 1];
        if (name.length < 5) validationErrors.push("Name must be at least 5 characters");
        if (!type) validationErrors.push("Event Type is required");
        if (!capacity && capacity !== 0) {
            validationErrors.push("Capacity is required");
        } else if (!Number.isInteger(capacity)) {
            validationErrors.push("Capacity must be an integer");
        } else if (capacity < 2) {
            validationErrors.push("Capacity must be at least 2");
        }
        if (!price) validationErrors.push("Price is required");
        if (!startDate) validationErrors.push("Event Start is required");
        if (!endDate) validationErrors.push("Event End is required");
        if (!(imgExt === "png" || imgExt === "jpg" || imgExt === "jpeg") || urlComponents.length < 2) {
            validationErrors.push("Image URL must end in .png, .jpg, or .jpeg");
        }
        if (description.length < 30) validationErrors.push("Description must be at least 30 characters long");

        setErrors(validationErrors);
    }, [name, type, capacity, price, startDate, endDate, imageUrl, description]);

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
                <div className='name'>
                    <p>What is the name of your event?</p>
                    <label>
                        <input
                        required={true}
                        type='text'
                        value={name}
                        placeholder='Event Name'
                        onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    {findErr(errors, "Name")}

                </div>
                <div className='basics'>
                    <div className='type'>
                    <p>Is this an in person or online event?</p>
                        <label>
                            <select value={type} required={true} onChange={(e) => setType(e.target.value)}>
                                <option disabled={true} value='' >(select one)</option>
                                <option value="In person">In Person</option>
                                <option value="Online">Online</option>
                            </select>
                        </label>
                        {findErr(errors, "Type")}
                    </div>
                    <div className='capacity'>
                        <p>How many people can your event accommodate?</p>
                        <label>
                            <input
                            required={true}
                            type='number'
                            value={capacity}
                            placeholder='Event Capacity'
                            onChange={(e) => setCapacity(Number(e.target.value))}
                            />
                        </label>
                        {findErr(errors, "Capacity")}
                    </div>
                    <div className='price'>
                        <p>What is the price for your event?</p>
                        <label>
                            <input
                            required={true}
                            type='number'
                            value={price}
                            placeholder={0}
                            onChange={(e) => setPrice(e.target.value)}
                            />
                        </label>
                        {findErr(errors, "Price")}
                    </div>
                </div>
                <div className='schedule'>
                    <div className='start'>
                        <label htmlFor="event-start">When does your event start?</label>
                        <input type="datetime-local" id="meeting-time" required={true}
                            name="event-start" value={startDate}
                            min="1300-06-07T00:00" max="2100-06-14T00:00"
                            onChange={(e) => setStartDate(e.target.value)} />
                        {findErr(errors, "Start")}
                    </div>
                    <div className='end'>
                        <label htmlFor="event-end">When does your event end?</label>
                        <input type="datetime-local" id="event-end" required={true}
                            name="event-end" value={endDate}
                            min="1300-06-07T00:00" max="2100-06-14T00:00"
                            onChange={(e) => setEndDate(e.target.value)} />
                        {findErr(errors, "End")}
                    </div>
                </div>
                <div className='img-input'>
                    <p>Please add in image url for your event below: </p>
                    <label>
                        <input
                            type="text"
                            required={true}
                            value={imageUrl}
                            placeholder="Image URL"
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    </label>
                    {findErr(errors, "Image")}
                </div>
                <div className='description'>
                    <p>Please describe your event: </p>
                    <label>
                        <textarea
                            value={description}
                            required={true}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Please include at least 30 characters'
                            rows={10}
                            cols={60}
                        />
                    </label>
                    {findErr(errors, "Description")}
                </div>
            </div>
            <div className='bottom'>
                <input type="submit" value={formType} disabled={!!errors.length} />
            </div>
        </form>
    );
};

export default EventForm;
