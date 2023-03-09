import { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { createGroup, getAllGroups, editGroup, groupImageAdd } from '../../store/groups';
import { deleteImage } from '../../store/images';
import getImages from '../../utils/getImages';

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

    let eventFormHeader = null;

    if (formType === "Create event") {
        eventFormHeader = (<h2>{`Create an event for ${group.name}`}</h2>);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                        <label for="event-start">When does your event start?</label>
                        <input type="datetime-local" id="meeting-time"
                            name="event-start" value={startDate}
                            min="1300-06-07T00:00" max="2100-06-14T00:00" />
                    </div>
                </div>
            </div>


        </form>
    );
};

export default EventForm;
