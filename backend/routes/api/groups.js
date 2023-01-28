// backend/routes/api/groups.js
const express = require('express')
const { requireAuth } = require('../../utils/auth');
// const sequelize = require('sequelize');

const { Event, Group, Venue, Image, User, Membership, Attendance } = require('../../db/models');
const { extractPreviewImageURL, formatGroup, formatImage, formatEvent,
    isGroupOrganizer, hasValidStatus, removeKeysExcept /* formatMember */ } = require('../../utils/misc');

// for request body validations
const {
    validateGroupBody, validateVenueBody, validateEventBody
    } = require('../../utils/validation');

const router = express.Router();

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
router.get("/:groupId/events", async (req, res) => {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId, {
        include: [
            {model: Event,
                include: [
                    "Attendees",
                    "EventImages",
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
    } else {
        group.Events.forEach((event) => {
            Events.push(formatEvent(event));
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
    const groupId = Number(req.params.groupId);
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
            const image = await Image.create({groupId, url, groupPreview: preview});
            const newImage = await Image.findByPk(image.id);
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
                const updatedGroup = await Group.findByPk(groupId);

                const resGroup = formatGroup(updatedGroup);

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
            const groupRemains = await Group.findByPk(groupId);
            if (groupRemains) {
                res.status(400);
                return res.json({
                    "message": "Group was not successfully deleted",
                    "statusCode": 400,
                    Group: groupRemains
                  });
            } else {
                return res.json({
                    "message": "Successfully deleted",
                    "statusCode": 200
                  });
            }
        }
    } else {
        res.status(404);
        return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          });
    }
});



// Get All Venues for a Group specified by its id
router.get("/:groupId/venues", requireAuth,
    async (req, res, next) => {
        const { groupId } = req.params;
        const { user } = req;
        const validStatus = ["co-host"];

        const group = await Group.findByPk(groupId, {
            include: [{ model: Membership }, { model: Venue }]
        });

        if (group) {
            const authenticated = (
                isGroupOrganizer(user.id, group)
                || hasValidStatus(user.id, group.Memberships, validStatus)
                );

            // group.Members.forEach((member) => {
            //     if ((member.id === userId) && (member.status === "co-host")) {
            //         authenticated = true;
            //     }
            // });

            if (authenticated) {
                const Venues = formatGroup(group).Venues;
                return res.json({Venues});
            } else {
                const err = new Error("Only a group's organizer or a member of the group with a status of 'co-host' can perform this action.");
                err.status = 403;
                err.title = 'User not authorized';
                err.errors = {userId: "Only a group's organizer or a member of the group with a status of 'co-host' can see the venues associated with a group."};
                return next(err);
            }
        } else {
            res.status(404);
            return res.json({
                "message": "Group couldn't be found",
                "statusCode": 404
              });
        }
});

// Create a new Venue for a Group specified by its id
router.post("/:groupId/venues",
    requireAuth, validateVenueBody,
    async (req, res, next) => {
        const { groupId } = req.params;
        const { user } = req;
        const validStatus = ["co-host"];
        const { address, city, state, lat, lng } = req.body;

        const group = await Group.findByPk(groupId, {
            include: [{ model: Membership }, { model: Venue }]
        });

        if (group) {
            const authenticated = (
                isGroupOrganizer(user.id, group)
                || hasValidStatus(user.id, group.Memberships, validStatus)
                );
                if (authenticated) {
                    const venueExists = await Venue.findOne({where: {
                        groupId, address, city, state, lat, lng
                    }});
                    if (venueExists) {
                        const err = new Error(`The group "${group.name}" already has a venue at this location: ${venueExists.address}.`);
                        err.status = 403;
                        err.title = 'Venue creation failed';
                        err.errors = {groupId: `The group "${group.name}" already has a venue at this location: ${venueExists.address}.`};
                        return next(err);
                    } else {
                        await Venue.create({
                            groupId, address, city, state, lat, lng
                        });

                        const newVenue = await Venue.findOne({
                            where: { groupId, lat, lng }
                        });
                        return res.json(newVenue);
                    }
                } else {
                    const err = new Error("Only a group's organizer or a member of the group with a status of 'co-host' can perform this action.");
                    err.status = 403;
                    err.title = 'User not authorized';
                    err.errors = {userId: "Only a group's organizer or a member of the group with a status of 'co-host' can create a new venue for the group."};
                    return next(err);
                }
            } else {
                res.status(404);
                return res.json({
                    "message": "Group couldn't be found",
                    "statusCode": 404
                  });
            }
});

// Create an Event for a Group specified by its id
router.post("/:groupId/events", requireAuth, validateEventBody, async (req, res, next) => {
    const { user } = req;
    const userId = user.id;
    const { venueId, name, type, capacity, price,
            description, startDate, endDate } = req.body;
    const groupId = Number(req.params.groupId);
    const validStatus = ["co-host"];
    const attendanceStatus = "host";
    const group = await Group.findByPk(groupId, {
        include: [{ model: Membership }, { model: Venue }]
    });

    if (group) {
        const authenticated = (
            isGroupOrganizer(userId, group)
            || hasValidStatus(userId, group.Memberships, validStatus)
            );
        if (authenticated) {
            if (venueId) {
                const venue = await Venue.findByPk(venueId, { where: { groupId } });
                if (!venue) {
                    res.status(404);
                    return res.json({
                        "message": "Venue couldn't be found",
                        "statusCode": 404
                      });
                }
            }
            const event = await Event.create({ groupId, venueId, name, type, capacity, price,
                description, startDate, endDate });
            const eventId = event.id;

            await Attendance.create({ userId, eventId, status: attendanceStatus });

            const eventAttendance = await Attendance.findOne({ where: { userId, eventId } });

            const createdEvent = formatEvent(await Event.scope("eventDetails").findByPk(eventAttendance.eventId));


            return res.json(createdEvent);
        } else {
            const err = new Error("Only a group's organizer or a member of the group with a status of 'co-host' can perform this action.");
            err.status = 403;
            err.title = 'User not authorized';
            err.errors = {userId: "Only a group's organizer or a member of the group with a status of 'co-host' can create a new event for the group."};
            return next(err);
        }
    } else {
        res.status(400);
        return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          });
    }
});

// Get all Members of a Group specified by its id
router.get("/:groupId/members", async (req, res) => {
    const groupId = Number(req.params.groupId);
    const { user } = req;
    const excludedStatus = [];
    const Members = [];
    const group = await Group.findByPk(groupId, {
        include: ["Members"]
    });

    if (group) {
        if (!user || (user.id !== group.organizerId)) {
            excludedStatus.push("pending");
        }

        group.Members.forEach((member) => {
            const memStat = member.Membership.status;
            if (!excludedStatus.includes(memStat)) {
                const formattedMember = member.toJSON();
                const Membership = formattedMember.Membership;
                removeKeysExcept(Membership, ["status"]);
                Members.push(formattedMember)
                // Members.push(formatMember(member));
            }
        });

        return res.json({Members});
    } else {
        res.status(404);
        return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          });
    }
});

// Request a new Membership for a Group based on the Group's id
router.post("/:groupId/membership", requireAuth, async (req, res) => {
    const groupId = Number(req.params.groupId);
    const { user } = req;
    const initStatus = "pending";
    const userId = user.id;
    const group = await Group.findByPk(groupId, {
        include: [{model: Membership.scope("membershipDetails")}]
    });
    let membership = null;
    if (group) {
        group.Memberships.forEach((mem) => {
            if (mem.userId === userId) {
                membership = mem;
            }
        });

        if (membership) {
            if (membership.status === initStatus) {
                res.status(400);
                return res.json({
                    "message": "Membership has already been requested",
                    "statusCode": 400
                  });
            } else {
                res.status(400);
                return res.json({
                    "message": "User is already a member of the group",
                    "statusCode": 400
                  });
            }
        } else {
            await Membership.create({ userId, groupId, status: initStatus });
            membership = await Membership.scope("membershipDetails").findOne({
                where: { userId, groupId }
            });
            return res.json({
                memberId: membership.userId, status: membership.status
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

// Change the status of a membership for a group specified by id
router.put("/:groupId/membership", requireAuth, async (req, res, next) => {
    const groupId = Number(req.params.groupId);
    const { user } = req;
    const userId = user.id;
    const { memberId, status } = req.body;
    // valid membership statuses for the request body
    const validReqStatus = ["member", "co-host"];
    // valid membership status for current user to make changes
    const validUserStatus = ["co-host"];

    const group = await Group.findByPk(groupId, {
        include: [{model: Membership.scope("membershipDetails")}]
    });

    const membership = await Membership.scope("membershipDetails").findOne({
         where: { userId: memberId, groupId }
        });

    if (group) {
        if (membership) {
            const oldStatus = membership.status;
            if (validReqStatus.includes(status)) {
                let authorized = isGroupOrganizer(userId, group);

                if ((oldStatus === "pending") && (status === "member")) {
                    authorized = (authorized || hasValidStatus(userId, group.Memberships, validUserStatus));
                }

                if (authorized) {
                    membership.set({status});
                    await membership.save();
                    let updatedMembership = await Membership.scope("membershipDetails").findOne({
                        where: { userId: membership.userId, groupId: membership.groupId }
                       });
                    updatedMembership = updatedMembership.toJSON();
                    if ("userId" in updatedMembership) {
                        updatedMembership.memberId = updatedMembership.userId;
                        delete updatedMembership.userId;
                    }
                    return res.json(updatedMembership);
                } else {
                    const err = new Error("Only a group's organizer or a member of the group with a status of 'co-host' can change membership status, and only the group organizer can make another user a co-host.");
                    err.status = 403;
                    err.title = 'User not authorized';
                    err.errors = {userId: "Only a group's organizer or a member of the group with a status of 'co-host' can change membership status, and only the group organizer can make another user a co-host."};
                    return next(err);
                }
            } else {
                // handle this case with express-validator if there is time
                res.status(400);
                return res.json({
                    "message": "Validations Error",
                    "statusCode": 400,
                    "errors": {
                      "status" : `Cannot change a membership status to ${status}`
                    }
                  });
            }
        } else {
            res.status(404);
            return res.json({
                "message": "Membership between the user and the group does not exits",
                "statusCode": 404
              });
        }
    } else {
        res.status(404)
        return res.json({
            "message": "Group couldn't be found",
            "statusCode": 404
          });
    }
});

// Delete membership to a group specified by id
router.delete("/:groupId/membership", requireAuth, async (req, res, next) => {
    const groupId = Number(req.params.groupId);
    const { user } = req;
    const userId = user.id;
    const { memberId } = req.body;

    const group = await Group.findByPk(groupId, {
        include: [{model: Membership}]
    });

    if (group) {
        const authorized = (isGroupOrganizer(userId, group) || (userId === memberId));

        if (authorized) {
            const reqUser = await User.findByPk(memberId);
            if (reqUser) {
                const membership = await Membership.findOne({
                    where: { userId: memberId, groupId }
                   });

                   if (membership) {
                    const membershipId = membership.id;
                    await membership.destroy();
                    const targetRemains = await Membership.findByPk(membershipId);

                    if (targetRemains) {
                        res.status(418);
                        return res.json({
                            "message": "Failed to delete membership from group"
                          });
                    } else {
                        return res.json({
                        "message": "Successfully deleted membership from group"
                      });
                    }
                   } else {
                    res.status(404);
                    return res.json({
                        "message": "Membership does not exist for this User",
                        "statusCode": 404
                      });
                   }
            } else {
                res.status(400);
                return res.json({
                    "message": "Validation Error",
                    "statusCode": 400,
                    "errors": {
                      "memberId": "User couldn't be found"
                    }
                  });
            }

        } else {
            res.status(403);
            return res.json({
                "message": "Forbidden",
                "statusCode": 403
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
