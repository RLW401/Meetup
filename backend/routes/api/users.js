// backend/routes/api/users.js
const express = require('express')
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

// For Validating Signup Request Body
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const nameMinLen = 1;
const nameMaxLen = 32;

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .isLength({ min: nameMinLen, max: nameMaxLen})
      .withMessage(`First name must be between ${nameMinLen} and ${nameMaxLen} characters long.`),
    check('lastName')
      .exists({ checkFalsy: true })
      .isLength({ min: nameMinLen, max: nameMaxLen})
      .withMessage(`Last name must be between ${nameMinLen} and ${nameMaxLen} characters long.`),
    handleValidationErrors
  ];

const router = express.Router();

// Sign up
router.post('/', validateSignup, async (req, res, next) => {
      const { email, password, username, firstName, lastName } = req.body;

      const userExists = await User.findOne({
        where: {[Op.or]: [{email}, {username}]},
        attributes: ["email", "username"]
      });

      if (!userExists) {
        const user = await User.signup({ email, username, password, firstName, lastName });

        await setTokenCookie(res, user);
        // const token = await setTokenCookie(res, user);

        // const userRes = user.toJSON();
        // userRes.token = token;

        return res.json(user);
      } else {
        // const err = new Error("User already exists");
        // err.status = 403;
        // err.title = 'signup failed';
        // err.errors = {email: "User with that email already exists"};
        // return next(err);

      const errObj = {
        "message": "User already exists",
        "statusCode": 403,
        "errors": {}
      }

      if (userExists.email === email) {
        errObj.errors["email"] = "User with that email already exists";
      }
      if (userExists.username === username) {
        errObj.errors["username"] = "User with that username already exists";
      }

      res.status(403);
      return res.json(errObj);
    }
  });

module.exports = router;
