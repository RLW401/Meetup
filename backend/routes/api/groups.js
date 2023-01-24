// backend/routes/api/groups.js
const express = require('express')

const { Event, Group, Venue, Image, User, Membership } = require('../../db/models');
const { extractPreviewImageURL, formatDate } = require('../../utils/misc');

// For Validating Signup Request Body
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all Groups
router.get('/', async (req, res) => {
    const Groups = await Group.findAll({
        include: [{model: Membership}, {model: Image}]
    });
    const resGroups = [];

    Groups.forEach((group) => {
        const formattedGroup = group.toJSON()
        formattedGroup.createdAt = formatDate(formattedGroup.createdAt);
        formattedGroup.updatedAt = formatDate(formattedGroup.updatedAt);

        resGroups.push(formattedGroup);
    });



    return res.json({Groups: resGroups});
});

// Get all Events of a Group specified by its id
router.get("/:groupId/events", async (req, res, next) => {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId, {
        include: [
            {model: Event,
                include: [
                    {model: User},
                    {model: Image},
                    { model: Group,
                    attributes: ["id", "name", "city", "state"] },
                    { model: Venue,
                    attributes: ["id", "city", "state"] }
                ]}
        ]
    });

    const Events = [];

    if (!group) {
        // const err = new Error("Group couldn't be found");
        res.status(404);
        res.message = "Group couldn't be found";
        return res.json({message: "Group couldn't be found",
        statusCode: 404
    });
        // next(err);
    } else {
        group.Events.forEach((event) => {
            const jsonEvent = event.toJSON();

            const previewImage = extractPreviewImageURL(jsonEvent.Images, "event");
            const userList = jsonEvent.Users;
            const numAttending = userList.length;
            jsonEvent.numAttending = numAttending;
            jsonEvent.previewImage = previewImage;
            delete jsonEvent.Users;
            delete jsonEvent.Images;

            Events.push(jsonEvent);
        });

        return res.json({Events});
    }
});

module.exports = router;
