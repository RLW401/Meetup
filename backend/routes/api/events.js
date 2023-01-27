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
    validateGroupBody, validateVenueBody, validateEventBody
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

// Add an Image to an Event based on the Event's id
router.post("/:eventId/images", requireAuth, async (req, res) => {
    const eventId = Number(req.params.eventId);
    const { user } = req;
    const { url, preview } = req.body;
    const validStatus = ["attendee", "host", "co-host"];
    const event = await Event.findByPk(eventId, {
        include: ["Attendees"]
    });

    if (event) {
        const authenticated = hasValidStatus(user.id, event.Attendees, validStatus);

        if (authenticated) {
            const image = Image.create({ url, eventPreview: preview});
            const resImage = formatImage(await Image.findByPk(image.id));
            return res.json(resImage);
        } else {
            const err = new Error("Current User must be an attendee, host, or co-host of the event to add an image.");
            err.status = 403;
            err.title = 'User not authorized';
            err.errors = {userId: "Current User must be an attendee, host, or co-host of the event to add an image."};
            return next(err);
        }
    } else {
        res.status(404);
        return res.json({
            "message": "Event couldn't be found",
            "statusCode": 404
          });
    }
});

// Edit an Event specified by its id
router.put("/:eventId", requireAuth, validateEventBody, async (req, res, next) => {
    const { user } = req;
    const eventId = Number(req.params.eventId);
    const { venueId, name, type, capacity, price,
        description, startDate, endDate } = req.body;
    const validStatus = ["co-host"];

    const event = Event.findByPk(eventId);

    if (event) {
        const groupId = event.groupId;
        const group = Group.findByPk(groupId, {
            include: ["Members", { model: Venue }]
        });
        const authenticated = (
            isGroupOrganizer(user.id, group)
            || hasValidStatus(user.id, group.Members, validStatus)
            );
        if (authenticated) {
            // check to see if venueId was supplied in body
            if (venueId) {
                // if a venueId was supplied, check to see if it corresponds
                // to a venue associated with the current group
                const venue = await Venue.findByPk(venueId, { where: { groupId } });
                if (venue) {
                    event.set({venueId});
                } else {
                    res.status(404);
                    return res.json({
                        "message": "Venue couldn't be found",
                        "statusCode": 404
                      });
                }
            }
            event.set({ name, type, capacity, price,
                description, startDate, endDate });

            await event.save();
            const updatedEvent = formatEvent(await Event.findByPk(event.id));

            return res.json(updatedEvent);
        } else {
            // not an authenticated user
            const err = new Error("Only a group's organizer or a member of the group with a status of 'co-host' can perform this action.");
            err.status = 403;
            err.title = 'User not authorized';
            err.errors = {userId: "Only a group's organizer or a member of the group with a status of 'co-host' can edit an event for the group."};
            return next(err);
        }
    } else {
        // event can't be found
        res.status(404);
        return res.json({
            "message": "Event couldn't be found",
            "statusCode": 404
          });
    }
});

// Delete an Event specified by its id
router.delete("/:eventId", requireAuth, async (req, res) => {
    const eventId = Number(req.params.eventId);
    const { user } = req;
    const validStatus = ["co-host"];

    const event = Event.findByPk(eventId);

    if (event) {
        const groupId = event.groupId;
        const group = Group.findByPk(groupId, {
            include: ["Members"]
        });
        const authenticated = (
            isGroupOrganizer(user.id, group)
            || hasValidStatus(user.id, group.Members, validStatus)
            );
        if (authenticated) {
            await event.destroy();
            const eventRemains = Event.findByPk(eventId);
            if (eventRemains) {
                res.status(400);
                return res.json({
                    "message": "Event was not successfully deleted",
                    "statusCode": 400,
                    Event: eventRemains
                  });
            } else {
                return res.json({"message": "Successfully deleted"});
            }
        } else {
            // not an authenticated user
            const err = new Error("Only a group's organizer or a member of the group with a status of 'co-host' can perform this action.");
            err.status = 403;
            err.title = 'User not authorized';
            err.errors = {userId: "Only a group's organizer or a member of the group with a status of 'co-host' can delete an event from the group."};
            return next(err);
        }
    } else {
        res.status(404);
        return res.json({
            "message": "Event couldn't be found",
            "statusCode": 404
          });
    }
});


module.exports = router;
