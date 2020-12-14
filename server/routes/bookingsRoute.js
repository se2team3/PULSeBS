const express = require('express');
const authorize = require('../services/authorizeService');
const role = require('../utils/roles');
const extendedLectureService = require('../services/extendedLectureService');

const router = express.Router();

router.get(`/bookings`, authorize([role.Teacher, role.BookingManager]), async (req, res) => {
  const { sub, role } = req.user;
  const { from, to } = req.query;
  try{
    const lectures = role === role.Teacher
      ? await extendedLectureService.getLecturesByTeacherId(sub, from, to)
      : await extendedLectureService.getAllLectures(from, to);
    return res.json(lectures);
  } catch(error){
    res.json(error);
  }
});

module.exports = router;
