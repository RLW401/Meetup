const sortEvents = (events) => {
    const pastEvents = [];
    const futureEvents = [];
    if (events.allIds) {
        const currentDate = new Date();
        events.allIds.forEach((eventId) => {
            if (new Date(events[eventId].startDate) > currentDate) {
                futureEvents.push({ ...events[eventId] });
            } else {
                pastEvents.push({ ...events[eventId] });
            }
        });
        pastEvents.sort((a, b) => {
            if (new Date(a.startDate) < new Date(b.startDate)) return 1;
            return -1;
        });
        futureEvents.sort((a, b) => {
            if (new Date(a.startDate) < new Date(b.startDate)) return -1;
            return 1;
        });
    }
    return ([pastEvents, futureEvents]);
};

export default sortEvents;
