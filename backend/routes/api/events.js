// backend/routes/api/events.js
const express = require('express')

const { Event, Group, Venue, Image, User } = require('../../db/models');
const { extractEventPreviewImageURL } = require('../../utils/misc');

// For Validating Signup Request Body
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all Events
router.get('/', async (_req, res) => {
    const Events = await Event.findAll({
        include: [
            {model: User},
            {model: Image},
            { model: Group,
            attributes: ["id", "name", "city", "state"] },
            { model: Venue,
            attributes: ["id", "city", "state"] }
        ]
    });

    const eventList = [];

    Events.forEach((event) => {
        eventList.push(event.toJSON());
    });

    eventList.forEach((event) => {
        // let startDateString = event.startDate.toString();

        const previewImage = extractEventPreviewImageURL(event.Images);
        const userList = event.Users;
        const numAttending = userList.length;

        event.numAttending = numAttending;
        event.previewImage = previewImage;
        delete event.Users;
        delete event.Images;
        // event.startDate = startDateString;
    });

    return res.json({Events: eventList});
});

module.exports = router;
