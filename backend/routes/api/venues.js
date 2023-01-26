// backend/routes/api/venues.js
const express = require('express')
const { requireAuth } = require('../../utils/auth');
// const sequelize = require('sequelize');

const { Event, Group, Venue, Image, User, Membership } = require('../../db/models');
const { extractPreviewImageURL, formatGroup, formatImage,
    isGroupOrganizer, hasValidStatus } = require('../../utils/misc');

// for request body validations
const {
    validateGroupBody, validateVenueBody
    } = require('../../utils/validation');

const router = express.Router();
