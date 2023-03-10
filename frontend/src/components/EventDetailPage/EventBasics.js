import EventDeleteModal from "../EventDelete/EventDeleteModal";

const EventBasics = ({ event, authorized }) => {
    return (
        <div className="event-basics">
            <div className="icons">
                <div className="clock">

                </div>
                <div className="dollar-sign">

                </div>
                <div className="ball-on-stick">

                </div>

            </div>
            <div className="info">
                <div className="schedule">
                    <div className="start">
                        <p>START </p>
                        <p>{event.startDate}</p>
                    </div>
                    <div className="end">
                        <p>START </p>
                        <p>{event.endDate}</p>
                    </div>

                </div>
                <div className="cost">
                    {(event.price === 0) ? "FREE" : event.price}
                </div>
                <div className="type">
                    <p>{event.type}</p>
                    {authorized && <EventDeleteModal />}
                </div>
            </div>

        </div>
    );
}

export default EventBasics;
