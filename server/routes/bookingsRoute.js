const express = require('express');
const authorize = require('../services/authorizeService');
const role = require('../utils/roles');
const extendedLectureService = require('../services/extendedLectureService');

const router = express.Router();

router.get(`/bookings`, authorize([ role.Teacher, role.BookingManager ]), async (req, res) => {
  const { sub } = req.user;
  const { from, to } = req.query;
  try {
    return res.json(await extendedLectureService.getLecturesByTeacherId(sub, from, to));
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
