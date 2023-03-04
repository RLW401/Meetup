// backend/utils/validation.js
const { validationResult, check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()
      .map((error) => `${error.msg}`);

    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad request.';
    next(err);
  }
  next();
};

const validateGroupBody = [
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters or less"),
  check('about')
    .exists({ checkFalsy: true })
    .isLength({ min: 30 })
    .withMessage("About must be 50 characters or more"),
  check('type')
    .exists({ checkFalsy: true })
    .matches(/^Online|In person?/) // ?
    .withMessage("Type must be 'Online' or 'In person'"),
  check('private')
    .exists({ checkFalsy: false })
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

const validateVenueBody = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  check('lat')
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude is not valid"),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude is not valid"),

    handleValidationErrors
];

const validateEventBody = [
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check('type')
    .exists({ checkFalsy: true })
    .matches(/^Online|In person?/)
    .withMessage("Type must be Online or In person"),
  check('capacity')
    .exists({ checkFalsy: true })
    .isInt()
    .withMessage("Capacity must be an integer"),
  // check('price')  // ????
  //   .exists({ checkFalsy: true })
  //   .isCurrency() // ???????????????
  //   // .isFloat()
  //   .withMessage("Price is invalid"),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  // check('startDate') // ?????
  //   .exists({ checkFalsy: true })
  //   .isDate()
  //   .isAfter()
  //   .withMessage("Start date must be in the future"),
  // check('endDate') // ?????
  //   .exists({ checkFalsy: true })
  //   .isDate()
  //   .isAfter('startDate') // ??????????
  //   .withMessage("End date is less than start date"),

    handleValidationErrors
];


module.exports = { handleValidationErrors,
  validateGroupBody, validateVenueBody,
  validateEventBody };
