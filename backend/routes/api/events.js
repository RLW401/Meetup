// backend/routes/api/events.js
const express = require('express')
const { requireAuth } = require('../../utils/auth');
const sequelize = require('sequelize');
const { Op } = sequelize;

const { Event, Group, Venue, Image, User, Membership, Attendance } = require('../../db/models');
const { extractPreviewImageURL, formatGroup, formatImage, formatEvent, removeKeysExcept,
    isGroupOrganizer, hasValidStatus, determineStatus, deleteImage,
    instanceNotFound } = require('../../utils/misc');

// for request body validations
const {
    validateGroupBody, validateVenueBody, validateEventBody
    } = require('../../utils/validation');

const router = express.Router();

const defaultUnauthorized = {
    "message": "Forbidden",
    "statusCode": 403
  };

// Get all Events
router.get('/', async (_req, res) => {
    const Events = await Event.findAll({
        include: [
            "Attendees",
           // { model: Attendance },
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
        //eventList.push(event)
    });

    return res.json({Events: eventList});
});

// Get details of an Event specified by its id
router.get("/:eventId", async (req, res) => {
    const { eventId } = req.params;
    const event = await Event.scope("eventDetails").findByPk(eventId, {
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
        return res.json(instanceNotFound("Event"));
    }
});

// Add an Image to an Event based on the Event's id
router.post("/:eventId/images", requireAuth, async (req, res, next) => {
    const eventId = Number(req.params.eventId);
    const { user } = req;
    const { url, preview } = req.body;
    const validStatus = ["attendee", "host", "co-host"];
    const event = await Event.findByPk(eventId, {
        include: [{ model: Attendance }]
    });

    if (event) {
        const authenticated = hasValidStatus(user.id, event.Attendances, validStatus);

        if (authenticated) {
            const image = await Image.create({eventId, url, eventPreview: preview});
            const newImage = await Image.findByPk(image.id);
            return res.json(formatImage(newImage, "event"));
        } else {
            const err = new Error("Current User must be an attendee, host, or co-host of the event to add an image.");
            err.status = 403;
            err.title = 'User not authorized';
            err.errors = {userId: "Current User must be an attendee, host, or co-host of the event to add an image."};
            return next(err);
        }
    } else {
        res.status(404);
        return res.json(instanceNotFound("Event"));
    }
});

// Edit an Event specified by its id
router.put("/:eventId", requireAuth, validateEventBody, async (req, res, next) => {
    const { user } = req;
    const eventId = Number(req.params.eventId);
    const { venueId, name, type, capacity, price,
        description, startDate, endDate } = req.body;
    const validStatus = ["co-host"];

    const event = await Event.findByPk(eventId);

    if (event) {
        const groupId = event.groupId;
        const group = await Group.findByPk(groupId, {
            include: [{model: Membership.scope("membershipDetails")}, { model: Venue }]

        });
        const authenticated = (
            hasValidStatus(user.id, group.Memberships, validStatus)
            || isGroupOrganizer(user.id, group)
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
                    return res.json(instanceNotFound("Venue"));
                }
            }
            event.set({ name, type, capacity, price,
                description, startDate, endDate });

            await event.save();
            const updatedEvent = await Event.scope("eventDetails").findByPk(event.id);

            return res.json(formatEvent(updatedEvent));
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
        return res.json(instanceNotFound("Event"));
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
            include: [{model: Membership}]
        });
        const authenticated = (
            isGroupOrganizer(user.id, group)
            || hasValidStatus(user.id, group.Memberships, validStatus)
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
        return res.json(instanceNotFound("Event"));
    }
});

// Get all Attendees of an Event specified by its id
router.get("/:eventId/attendees", async (req, res) => {
    const eventId = Number(req.params.eventId);
    const { user } = req;
    const excludedStatus = [];
    const Attendees = [];
    const validMemStat = ["co-host"];

    const event = await Event.findByPk(eventId, {
        include: ["Attendees"]
    });

    if (event) {
        const { groupId } = event;
        const group = await Group.findByPk(groupId, {
            include: { model: Membership }
        });

        // if there is no user logged in
        if (!user) {
            // do not show attendees with pending status
            excludedStatus.push["pending"];
        } else {
            const userId = user.id;
            const organizer = isGroupOrganizer(userId, group);
            const authMemStat = hasValidStatus(userId, group.Memberships, validMemStat);

            // if the current user is neither the group organizer,
            // nor a member of the group with the appropriate status
            if (!((organizer) || (authMemStat))) {
                // do not show attendees with pending status
                excludedStatus.push["pending"];
            }
        }

        event.Attendees.forEach((attendee) => {
            const formattedAttendee = attendee.toJSON()
            const attStat = formattedAttendee.Attendance.status;
            if (!excludedStatus.includes(attStat)) {
                const Attendance = formattedAttendee.Attendance;
                removeKeysExcept(Attendance, ["status"]);
                Attendees.push(formattedAttendee);
            }
        });

        return res.json({Attendees});
    } else {
        res.status(404);
        return res.json(instanceNotFound("Event"));
    }
});

// Request to Attend an Event based on the Event's id
router.post("/:eventId/attendance", requireAuth, async (req, res) => {
    const eventId = Number(req.params.eventId);
    const { user } = req;
    const userId = user.id;
    const initStatus = "pending";
    const event = await Event.findByPk(eventId, {
        include: ["Attendees", { model: Group, include: ["Members"]}]
    });

    if (event) {
        const { groupId } = event;
        // const membership = await Membership.findOne({
        //     where: { userId, groupId }
        // });

        const membership = determineStatus(userId, event.Group.Members);

        if (membership && (membership !== initStatus)) {
            const attendance = determineStatus(userId, event.Attendees);
            if (!attendance) {
                await Attendance.create({userId, eventId, status: initStatus});
                const newAttendance = await Attendance.findOne({
                    where: {userId, eventId}
                });

                return res.json(removeKeysExcept(newAttendance, ["userId", "status"]));

            } else if (attendance === initStatus) {
                res.status(400);
                return res.json({
                    "message": "Attendance has already been requested",
                    "statusCode": 400
                  });
            } else {
                res.status(400);
                return res.json({
                    "message": "User is already an attendee of the event",
                    "statusCode": 400
                  });
            }
        } else {
            res.status(403)
            return res.json(    {
                "message": "Forbidden",
                "statusCode": 403
              });
        }
    } else {
        res.status(404);
        return res.json(instanceNotFound("Event"));
    }
});

// Change the status of an attendance for an event specified by id
router.put("/:eventId/attendance", requireAuth, async (req, res) => {
    const eventId = Number(req.params.eventId);
    const { user } = req;
    const userId = user.id;
    const initStatus = "pending";
    const authMemStat = ["co-host"];
    const attendeeId = req.body.userId;
    const newStatus = req.body.status;
    const event = await Event.findByPk(eventId, {
        include: ["Attendees", { model: Group, include: ["Members"]}]
    });

    if (event) {
        const group = event.Group;
        const members = group.Members;
        const organizer = isGroupOrganizer(userId, group);
        const memStat = determineStatus(userId, members);

        if (authMemStat.includes(memStat) || organizer) {
            const attendance = await Attendance.findOne({
                where: { userId: attendeeId, eventId }
            });

            if (attendance) {
                if (newStatus === initStatus) {
                    res.status(400);
                    return res.json({
                        "message": `Cannot change an attendance status to ${initStatus}`,
                        "statusCode": 400
                      });
                } else {
                    await attendance.update({ status: newStatus });
                    const updatedAttendance = await Attendance.findOne({
                        where: { userId: attendeeId, eventId }
                    });
                    return res.json(updatedAttendance);
                }
            } else {
                res.status(404);
                return res.json({
                    "message": "Attendance between the user and the event does not exist",
                    "statusCode": 404
                  });
            }
        } else {
            res.status(403);
            return res.json(defaultUnauthorized);
        }

    } else {
        res.status(404);
        return res.json(instanceNotFound("Event"));
    }
});

router.delete("/:eventId/attendance", requireAuth, async (req, res) => {
    const eventId = Number(req.params.eventId);
    const { user } = req;
    const userId = user.id;
    const attendeeId = req.body.userId;
    const event = await Event.findByPk(eventId, {
        include: ["Attendees", { model: Group, include: ["Members"]}]
    });

    if (event) {
        const group = event.Group;
        const organizer = isGroupOrganizer(userId, group);

        if ((userId === attendeeId) || organizer) {
            const attendance = await Attendance.findOne({
                where: { userId: attendeeId, eventId }
            });

            if (attendance) {
                await attendance.destroy();

                const targetRemains = await Attendance.findOne({
                    where: { userId: attendeeId, eventId }
                });

                if (targetRemains) {
                    return res.json({
                        "message": "Failed to successfully delete attendance from event"
                      });
                } else {
                    return res.json({
                        "message": "Successfully deleted attendance from event"
                      });
                }

            } else {
                res.status(404);
                return res.json({
                    "message": "Attendance between the user and the event does not exist",
                    "statusCode": 404
                  });
            }

        } else {
            res.status(403);
            return res.json(defaultUnauthorized);
        }
    } else {
        res.status(404);
        return res.json(instanceNotFound("Event"));
    }
});

module.exports = router;
