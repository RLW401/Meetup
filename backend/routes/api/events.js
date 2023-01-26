// backend/routes/api/events.js
const express = require('express')
const { requireAuth } = require('../../utils/auth');
const sequelize = require('sequelize');
const { Op } = sequelize;

const { Event, Group, Venue, Image, User, Membership } = require('../../db/models');
const { extractPreviewImageURL, formatGroup, formatImage, formatEvent,
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
            "Attendees",
            "EventImages",
            { model: Group,
            attributes: ["id", "name", "city", "state"] },
            { model: Venue,
            attributes: ["id", "city", "state"] }
        ]
    });

    const eventList = [];

    Events.forEach((event) => {
        eventList.push(formatEvent(event));
        // eventList.push(event)
    });

    return res.json({Events: eventList});
});

// Get details of an Event specified by its id
router.get("/:eventId", async (req, res) => {
    const { eventId } = req.params;
    const event = await Event.scope("eventDetail").findByPk(eventId, {
        include: [
            { model: User, as: "Attendees" },
            { model: Group,
                attributes: ["id", "name", "private", "city", "state"] },
                { model: Venue, attributes: { exclude: ["groupId", "createdAt", "updatedAt"] } },
            { model: Image, as: "EventImages" }
        ]
    });
    if (event) {
        const resEvent = formatEvent(event);
        // extract images from unformatted event
        const images = event.EventImages;
        // format event images
        const EventImages = [];
        images.forEach((image) => {
            EventImages.push(formatImage(image, "event"));
        });
        // add images back to formatted event
        resEvent.EventImages = EventImages

        // remove previewImage key
        if ("previewImage" in resEvent) {
            delete resEvent.previewImage;
        }
        return res.json(resEvent);
    } else {
        res.status(404);
        return res.json({
            "message": "Event couldn't be found",
            "statusCode": 404
          });
    }
});

module.exports = router;
