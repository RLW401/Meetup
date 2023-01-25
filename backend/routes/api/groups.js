// backend/routes/api/groups.js
const express = require('express')
const { requireAuth } = require('../../utils/auth');
// const sequelize = require('sequelize');

const { Event, Group, Venue, Image, User, Membership } = require('../../db/models');
const { extractPreviewImageURL, formatDate, formatGroup } = require('../../utils/misc');

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
        const formattedGroup = formatGroup(group);
        resGroups.push(formattedGroup);
    });

    return res.json({Groups: resGroups});
});

// Get all Groups joined or organized by the Current User
router.get("/current", requireAuth, async (req, res) => {
    const { user } = req;
    const userId = user.id;

    const Groups = await Group.findAll({
        include: [{model: Membership}, {model: Image}]
    });

    const resGroups = [];

    // filter out all Groups of which the current
    // user is not a member
    const currentGroups = Groups.filter((group) => {
        let current = false;
        group.Memberships.forEach((membership) => {
            if (membership.userId === userId) {
                current = true;
            }
        });
        return current;
    });

    currentGroups.forEach((group) => {
        const formattedGroup = formatGroup(group);
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

// router.get("/:groupId", (req, res) => {
//     const { groupId } = req.params;

//     const
// });

module.exports = router;
