const getGroupEvents = async (groupId) => {
    const url = `/api/groups/${groupId}/events`;
    try {
        const response = await fetch(url);
        const eventObj = await response.json();
        // the response should be an object with a single
        // key, "Events", with the value of an array of
        // event objects.
        if (eventObj.Events) return eventObj.events;

    } catch (error) {
        throw error;
    }
};

export default getGroupEvents;
