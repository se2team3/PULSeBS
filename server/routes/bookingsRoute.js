//import modules
const express = require('express');
//import validators
const {validator,lectureValidation }= require('../validators/validator');

//import models
const bookingService = require('../services/bookingService');
const Booking = require('../models/booking');



const router = express.Router();

router.post('/students/:student_id/bookings',lectureValidation.checkLecture(),validator, async(req,res) =>{
    const {lecture_id} = req.body;
    const student_id= + req.params.student_id;

    try{
        let booking = await bookingService.insertBooking({lecture_id,student_id});
        return res.status(201).json(booking);
    } catch(error){
        res.json(error);
    }
})
module.exports = router;
