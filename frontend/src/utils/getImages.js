// type must be either "group" or "event" -- not case sensitive
const getImages = async (type, id) => {
    type = type.toLowerCase();
    const images = [];
    const url = (
        "/api/" + type + "s/" + id
    );
    const imageKey = (
        type.slice(0, 1).toUpperCase()
        + type.slice(1) + "Images"
    );

    try {
        const response = await fetch(url);
        if (response.ok) {
            const obj = await response.json();
            // obj[imageKey] will be an array of image objects
            obj[imageKey].forEach((img) => images.push({ ...img }));

            return images;
        }
    } catch (error) {
        throw error;
    }

};

export default getImages;
