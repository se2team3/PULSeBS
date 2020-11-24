//import modules
const express = require('express');
const moment = require('moment');
//import validators
const {validator,lectureValidation }= require('../validators/validator');
const authorize = require('../services/authorizeService');
const role = require('../utils/roles');

//import models
const bookingService = require('../services/bookingService');
const lectureValidator = require('../validators/lectureValidator');

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
router.post('/students/:student_id/bookings', lectureValidation.checkLecture(),validator, async(req,res) =>{
    const {lecture_id} = req.body;
    const student_id= +req.params.student_id;
    try{
        let booking = await bookingService.insertBooking({lecture_id,student_id});
        return res.status(201).json(booking);
    } catch(error){
        res.status(400).json(error);
    }
})


/**
 * @swagger
 * //students/{student_id}/delete_booking:
 *  post:
 *    tags:
 *      - students
 *    summary: "Delete a new booking"
 *    description: "A student can delete a lecture "
 *    parameters:
 *      - in: path
 *        name: student_id
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *    responses:
 *       "201 and num=1":
 *         description: "Successful deletion"
 *         schema:
 *           type: "object"
 *       "201 and num=0":
 *         description: "Nothing to delete"
 *         schema:
 *           type: "object"
 *       "400":
 *         description: "Invalid status value"
 *    security:
 *     - petstore_auth:
 *       - "write:pets"
 *       - "read:pets"
 */
router.post('/students/:student_id/delete_booking', lectureValidation.checkLecture(),validator, async(req,res) =>{
    const {lecture_id} = req.body;
    const student_id= +req.params.student_id;
    const datetime= moment();
    try{
        let number = await bookingService.deleteBooking({datetime,lecture_id,student_id});
        if(number===1)
            return res.status(200).json({});
        else if (number==0) 
            return res.status(304).json({});
    } catch(error){
        res.status(400).json(error);
    }
})

module.exports = router;
