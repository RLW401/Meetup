const getImages = async (type, id) => {
    const images = [];
    const url = (
        "/api/" + type.slice(0,1).toLowerCase()
        + type.slice(1) + "s/" + id
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
