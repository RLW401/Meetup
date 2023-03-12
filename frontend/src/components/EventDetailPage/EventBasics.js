import EventDeleteModal from "../EventDelete/EventDeleteModal";
import "./eventDetail.css"

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
                <i className="fas f-regular fa-clock"> </i>
                    <div className="start">
                        <p>START </p>
                        <p>{event.startDate}</p>
                    </div>
                    <div className="end">
                        <p>END</p>
                        <p>{event.endDate}</p>
                    </div>

                </div>
                <div className="cost">
                    <i class="fas fa-dollar-sign"></i>
                    {(Number(event.price) === 0) ? "FREE" : event.price}
                </div>
                <div className="type">
                    <i class="fas fa-map-pin">{event.type}</i>
                    {/* <p>{event.type}</p> */}
                    {authorized && <EventDeleteModal />}
                </div>
            </div>

        </div>
    );
}

export default EventBasics;
