// backend/routes/api/index.js
const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');
const { requireAuth } = require('../../utils/auth');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js');
const venuesRouter = require('./venues.js')
const eventsRouter = require('./events.js');

const { deleteImage } = require('../../utils/misc');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/groups', groupsRouter);

router.use('/venues', venuesRouter);

router.use('/events', eventsRouter);

// Add a XSRF-TOKEN cookie
router.get("/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

// Delete an Image for a Group
router.delete("/group-images/:imageId", requireAuth, async (req, res, next) => {
  const imageId = Number(req.params.imageId);
  const { user } = req;
  const userId = Number(user.id);
  const imageType = "group";

  const result = await deleteImage(imageId, userId, imageType);

  if (result.statusCode) {
    res.status(result.statusCode);
  }
  return res.json(result);
});

// Delete an Image for an Event
router.delete("/event-images/:imageId", requireAuth, async (req, res, next) => {
  const imageId = Number(req.params.imageId);
  const { user } = req;
  const userId = Number(user.id);
  const imageType = "event";

  const result = await deleteImage(imageId, userId, imageType);

  if (result.statusCode) {
    res.status(result.statusCode);
  }
  return res.json(result);
});

module.exports = router;
