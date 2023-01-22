// backend/routes/api/groups.js
const express = require('express')

const { User, Group } = require('../../db/models');

// For Validating Signup Request Body
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all Groups
router.get('/', async (req, res) => {
    const Groups = await Group.findAll({});

    return res.json({Groups});
});

module.exports = router;
