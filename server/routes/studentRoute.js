const express = require('express');
const app = express.Router();

const studentService = require('../services/studentService');
const bookingService = require('../services/bookingService')
const authorize = require('../services/authorizeService');
const role = require('../utils/roles');
const timeValidator = require('../validators/timeValidator');
const {validator,lectureValidation }= require('../validators/validator');
const moment = require('moment');

/**
 * @swagger
 *  /students/:student_id/lectures:
 *  get:
 *    tags:
 *      - students
 *    summary: "Get the list of all lectures for a student"
 *    descritpion: "Used to retrieve all the lectures that can be attended by a specific
 *                  student in a time frame"
 *    parameters:
 *      - in: path
 *        name: student_id
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *      - in: query
 *        name: from
 *        required: false
 *        schema:
 *          type: string
 *          format: date
 *          description: "the start date for the query"
 *      - in: query
 *        name: to
 *        required: false
 *        schema:
 *          type: string
 *          format: date
 *          description: "the end date for the query"
 *    consumes:
 *       - "application/json"
 *    produces:
 *       - "application/json"
 *    responses:
 *       "200":
 *         description: "Successful response"
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Lecture"
 *       "400":
 *         description: "Invalid status value"
 *    security:
 *     - petstore_auth:
 *       - "write:pets"
 *       - "read:pets"
 */

app.get('/students/:student_id/lectures', authorize([role.Student]),timeValidator.checkTime, async(req,res) =>{
    const student_id = +req.params.student_id;
    const {from, to} = req.query;
    try{
        let lectures = await studentService.getStudentLectures(student_id, from, to);
        return res.status(200).json(lectures);
    } catch(error){
        res.status(400).json(error);
    }
})

/**
 * @swagger
 * /students/:lecture_id/:
 *  get:
 *    tags:
 *      - students
 *    summary: "Assert if a student can book a Lecture"
 *    description: "Assert if a student can book a Lecture"
 *    parameters:
 *      - in: path
 *        name: lecture_id
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *      - in: cookie
 *        name: user
 *        schema:
 *          type: object
 *    consumes:
 *       - "application/json"
 *    produces:
 *       - "application/json"
 *    responses:
 *       "200":
 *         description: "Successful response"
 *         schema:
 *           type: "object"
 *       "400":
 *         description: "Invalid status value"
 *    security:
 *     - petstore_auth:
 *       - "write:pets"
 *       - "read:pets"
 */

app.get('/students/:lecture_id/',authorize([role.Student]), async(req,res) =>{
    const lecture_id= req.params.lecture_id;
    const student_id=req.user && req.user.sub;
    try{
        let bool = await bookingService.assertBooking(student_id,lecture_id);
        return res.status(200).json(bool);
    } catch(error){
        res.status(400).json(error);
    }
  })

/**
 * @swagger
 * /students/{student_id}/bookings:
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
 *    requestBody:
 *      schema:
 *          type: object
 *          properties:
 *              student_id:
 *                  type: integer
 *                  format: int64
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
app.post('/students/:student_id/bookings', authorize([role.Student]), lectureValidation.checkLecture(), validator, async(req,res) =>{
    const {lecture_id} = req.body;
    const student_id = +req.params.student_id;
    try{
        let booking = await bookingService.insertBooking({lecture_id,student_id});
        return res.status(201).json(booking);
    } catch(error){
        res.status(400).json(error);
    }
})

/**
 * @swagger
 * /students/:student_id/lectures/:lecture_id:
 *  post:
 *    tags:
 *      - students
 *    summary: "Delete a booking"
 *    description: "A student can delete a lecture "
 *    parameters:
 *      - in: path
 *        name: student_id
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *      - in: path
 *        name: lecture_id
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *    responses:
 *       "201":
 *         description: "Successful deletion"
 *         schema:
 *           type: "object"
 *       "304":
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
app.delete('/students/:student_id/lectures/:lecture_id', authorize([role.Student]), async(req,res) =>{
    const student_id= +req.params.student_id;
    const lecture_id= +req.params.lecture_id;
    const datetime= moment().format('YYYY-MM-DD HH:mm');
    
    try{
        let number = await bookingService.deleteBooking({datetime,lecture_id,student_id});
        if(number===1)
            return res.status(200).json({});
        else if (number===0)
            return res.status(304).json({});
    } catch(error){
        res.status(400).json(error);
    }
})




module.exports = app;