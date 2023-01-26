// backend/routes/api/events.js
const express = require('express')
const { requireAuth } = require('../../utils/auth');
const sequelize = require('sequelize');
const { Op } = sequelize;

const { Event, Group, Venue, Image, User, Membership } = require('../../db/models');
const { extractPreviewImageURL, formatGroup, formatImage, formatEvent
    isGroupOrganizer, hasValidStatus } = require('../../utils/misc');

// for request body validations
const {
    validateGroupBody, validateVenueBody
    } = require('../../utils/validation');

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
        eventList.push(formatEvent(event));
    });

    return res.json({Events: eventList});
});

module.exports = router;
