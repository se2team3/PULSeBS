//import modules
const express = require('express');
//import validators
const {validator,lectureValidation }= require('../validators/validator');
const authorize = require('../services/authorizeService');
const role = require('../utils/roles');

//import models
const bookingService = require('../services/bookingService');

const router = express.Router();

/**
 * @swagger
 * //students/{student_id}/bookings:
 *  post:
 *    tags:
 *      - students
 *    summary: "Insert a new booking"
 *    description: "A student can book a lecture "
 *    parameters:
 *      - in: path
 *        name: student_id
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *    responses:
 *       "201":
 *         description: "Successful insertion"
 *         schema:
 *           type: "object"
 *       "400":
 *         description: "Invalid status value"
 *    security:
 *     - petstore_auth:
 *       - "write:pets"
 *       - "read:pets"
 */
router.post('/students/:student_id/bookings',authorize(role.Student), lectureValidation.checkLecture(),validator, async(req,res) =>{
    const {lecture_id} = req.body;
    const student_id= +req.params.student_id;
    console.log(`I'm booking`)
    try{
        let booking = await bookingService.insertBooking({lecture_id,student_id});
        console.log(`I have booked`)
        return res.status(201).json(booking);
    } catch(error){
        res.status(400).json(error);
    }
})
module.exports = router;
