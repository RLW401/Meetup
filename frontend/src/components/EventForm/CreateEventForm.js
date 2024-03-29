import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getGroupDetails } from "../../store/groupDetails";
import EventForm from "./EventForm";

const formType = "Create Event";
const dev = false;

const name = "Witch Burning";
const type = "In person";
const capacity = 9001;
const price = 0;
const description = "These odious crones have bedevilled us with their foul plague for long enough! \n\nUse this image: \n\nhttps://res.cloudinary.com/dqswruico/image/upload/v1678215281/14th%20Century%20Meetup/burning_woman_witchcraft_1050x700_qxykfx.jpg";
const startDate = "1350-11-19 19:00:00";
const endDate = "1350-11-19 23:30:00";

const devEvent = {
    name,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate
};

const productionEvent = {
    name: "",
    type: "",
    capacity: "",
    price: "",
    description: "",
    startDate: "",
    endDate: ""
};

const CreateEventForm = () => {
    const groupId = Number(useParams().groupId);
    const dispatch = useDispatch();
    const loadGroup = useSelector((state) => state.groupDetails);
    const [group, setGroup] = useState({});

    useEffect(() => {
        if (groupId) {
            dispatch(getGroupDetails(groupId));
        }
    }, [dispatch, groupId]);

    useEffect(() => {
        setGroup(loadGroup)
    }, [loadGroup]);


    let event;
    if (dev) {
        event = devEvent;
    } else {
        event = productionEvent;
    }
    if (group.id) {
        return (
            <EventForm event={event} formType={formType} group={group} />
        );
    }
};

export default CreateEventForm;
