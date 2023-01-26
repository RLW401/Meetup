// backend/routes/api/groups.js
const express = require('express')
const { requireAuth } = require('../../utils/auth');
// const sequelize = require('sequelize');

const { Event, Group, Venue, Image, User, Membership } = require('../../db/models');
const { extractPreviewImageURL, formatGroup, formatImage } = require('../../utils/misc');

// For Validating Signup Request Body
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateGroupBody = [
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ max: 60 })
      .withMessage("Name must be 60 characters or less"),
    check('about')
      .exists({ checkFalsy: true })
      .isLength({ min: 50 })
      .withMessage("About must be 50 characters or more"),
    check('type')
      .exists({ checkFalsy: true })
      .matches(/^Online|In person?/) // ?
      .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
      .exists({ checkFalsy: true })
      .isBoolean()
      .withMessage("Private must be a boolean"),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage("City is required"),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage("State is required"),


    handleValidationErrors
];

// Get all Groups
router.get('/', async (req, res) => {
    const Groups = await Group.findAll({
        include: ["Members", "GroupImages"]
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
        include: ["Members", "GroupImages"]
    });

    const resGroups = [];

    // filter out all Groups of which the current
    // user is not a member
    const currentGroups = Groups.filter((group) => {
        let current = false;
        group.Members.forEach((member) => {
            if (member.id === userId) {
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
                    "Attendees",
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

// Get details of a Group from an id
router.get("/:groupId", async (req, res) => {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId, {
        include: [
            "Organizer", "Members",
            {model: Venue}, "GroupImages"
        ]
    });

    if (group) {
        // extract images from group
        const images = group.GroupImages;
        const GroupImages = [];
        // format group images
        images.forEach((image) => {
            GroupImages.push(formatImage(image, "group"));
        });
        const detailedGroup = formatGroup(group)
        // add images back to formatted group
        detailedGroup.GroupImages = GroupImages;
        // remove previewImage key
        if ("previewImage" in detailedGroup) delete detailedGroup.previewImage;
        return res.json(detailedGroup);
    } else {
        return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          });
    }
});
// Create a Group
router.post('/', requireAuth, validateGroupBody, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;
    const { user } = req;
    const userId = user.id;
    const groupOwnerStatus = "member";
    const groupNameTaken = await Group.findOne({where: {name}});

    if (!groupNameTaken) {
        await Group.create({
            organizerId: userId,
            name,
            about,
            type,
            private,
            city,
            state
         });

         const newGroup = await Group.findOne({where: {name}});

         const groupId = newGroup.id;

         await Membership.create({
            userId,
            groupId,
            status: groupOwnerStatus
         });

         const newMembership = await Membership.findOne({
            where: {userId, groupId}
         });

         if (newGroup && newMembership) {
            return res.json(formatGroup(newGroup));
         } else {
            res.status(418);
            return res.json({
                "message": "Error in group or membership creation",
                "statusCode": 418
              });
         }
    } else {
        const err = new Error(`Group name "${name}" already taken`);
        err.status = 403;
        err.title = 'group creation failed';
        err.errors = {name: `Group with name "${name}" already exists`};
        return next(err);
    }
});

// Add an Image to a Group based on the Group's id
router.post("/:groupId/images", requireAuth, async (req, res, next) => {
    const { groupId } = req.params;
    const { url, preview } = req.body;
    const { user } = req;
    const userId = user.id;

    const imageExists = await Image.findOne({where: {groupId, url}});
    const group = await Group.findByPk(groupId);

    if (group) {
        const organizerId = group.organizerId;
        if (userId !== organizerId) {
            const err = new Error("Only a group's organizer can add an image");
            err.status = 403;
            err.title = 'User not authorized';
            err.errors = {organizerId: "Only a group's organizer can add an image"};
            return next(err);
        } else if (imageExists) {
            const err = new Error("Image already associated with this group");
            err.status = 403;
            err.title = 'add image failed';
            err.errors = {url: "This image has already been added to this group."};
            return next(err);
        } else {
            await Image.create({groupId, url, groupPreview: preview});
            const newImage = await Image.findOne({where: {groupId, url}});
            return res.json(formatImage(newImage, "group"));
        }
    } else {
        res.status(404);
        return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          });
    }
});

// Edit a Group
router.put("/:groupId",
    requireAuth, validateGroupBody,
    async (req, res, next) => {
        const groupId = Number(req.params.groupId);
        const { name, about, type, private, city, state } = req.body;
        const { user } = req;
        const userId = user.id;
        const group = await Group.findByPk(groupId);
        const groupNameTaken = await Group.findOne({where: {name}});

        if (group) {
            const organizerId = group.organizerId;
            if (userId !== organizerId) {
                const err = new Error("Only a group's organizer can edit the group.");
                err.status = 403;
                err.title = 'User not authorized';
                err.errors = {organizerId: "Only a group's organizer can edit the group."};
                return next(err);
            } else if (groupNameTaken && (Number(groupNameTaken.id) !== groupId)) {
                const err = new Error(`Group name "${name}" already taken`);
                err.status = 403;
                err.title = 'group update failed';
                err.errors = {name: `Another group with name "${name}" already exists`};
                return next(err);
            } else {
                group.set({ name, about, type, private, city, state });
                await group.validate();
                await group.save();

                const resGroup = formatGroup(group);

                return res.json(resGroup);
            }
        } else {
            res.status(404);
            return res.json({
                "message": "Group couldn't be found",
                "statusCode": 404
              });
        }
});

// Delete a Group
router.delete("/:groupId", requireAuth, async (req, res, next) => {
    const groupId = Number(req.params.groupId);
    const { user } = req;
    const userId = Number(user.id);
    const group = await Group.findByPk(groupId);

    if (group) {
        const organizerId = Number(group.organizerId);
        if (userId !== organizerId) {
            const err = new Error("Only a group's organizer can delete the group.");
            err.status = 403;
            err.title = 'User not authorized';
            err.errors = {organizerId: "A group can only be deleted by its organizer."};
            return next(err);
        } else {
            await group.destroy();
            return res.json({
                "message": "Successfully deleted",
                "statusCode": 200
              });
        }
    } else {
        res.status(404);
        return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          });
    }
});

module.exports = router;
