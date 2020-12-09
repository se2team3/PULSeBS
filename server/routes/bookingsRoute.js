const express = require('express');
const authorize = require('../services/authorizeService');
const role = require('../utils/roles');
const bookingService = require('../services/bookingService');

const router = express.Router();

router.get(`/bookings`, authorize([role.Teacher, role.BookingManager]), async (req, res) => {
  const { sub } = req.user;
  try{
    return res.json(await bookingService.retrieveBookingsByTeacherId(sub));
  } catch(error){
    res.json(error);
  }
});

module.exports = router;
