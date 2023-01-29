// backend/routes/api/venues.js
const express = require('express')
const { requireAuth } = require('../../utils/auth');
const sequelize = require('sequelize');
const { Op } = sequelize;

const { Event, Group, Venue, Image, User, Membership } = require('../../db/models');
const { extractPreviewImageURL, formatGroup, formatImage,
    isGroupOrganizer, determineStatus } = require('../../utils/misc');

// for request body validations
const {
    validateGroupBody, validateVenueBody
    } = require('../../utils/validation');

const router = express.Router();

// Edit a Venue specified by its id
router.put("/:venueId", requireAuth, validateVenueBody, async (req, res, next) => {
    const { venueId } = req.params
    const { user } = req;
    const userId = user.id;
    const validStatus = ["co-host"];
    const { address, city, state, lat, lng } = req.body;

    const venue = await Venue.findByPk(venueId);
    if (venue) {
        const { groupId } = venue;
        const group = await Group.findByPk(groupId, {include: [{ model: Membership }]});
        const venueExists = await Venue.findOne({
            where: { address, city, state, lat, lng, [Op.not]: [{groupId}] }
        });

        const memStat = determineStatus(userId, group.Memberships);
        const organizer = isGroupOrganizer(user.id, group);
        const authenticated = (validStatus.includes(memStat) || organizer);

            if (authenticated) {
                if (venueExists) {
                    const err = new Error(`The group "${group.name}" already has a venue at this location: ${venueExists.address}.`);
                    err.status = 403;
                    err.title = 'Venue update failed';
                    err.errors = {groupId: `The group "${group.name}" already has a venue at this location: ${venueExists.address}.`};
                    return next(err);
                } else {
                    venue.set({ address, city, state, lat, lng });
                    await venue.validate();
                    await venue.save();

                    const updatedVenue = await Venue.findByPk(venueId);

                    return res.json(updatedVenue);
                }
            } else {
                const err = new Error("Only a group's organizer or a member of the group with a status of 'co-host' can perform this action.");
                err.status = 403;
                err.title = 'User not authorized';
                err.errors = {userId: "Only a group's organizer or a member of the group with a status of 'co-host' can edit the venues associated with a group."};
                return next(err);
            }
    } else {
        res.status(404);
        return res.json({
            "message": "Venue couldn't be found",
            "statusCode": 404
          });
    }
});

module.exports = router;
