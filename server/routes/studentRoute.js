const express = require('express');
const app = express.Router();

const studentService = require('../services/studentService');
const bookingService = require('../services/bookingService')
const authorize = require('../services/authorizeService');
const role = require('../utils/roles');
const timeValidator = require('../validators/timeValidator');

/* cannot be used like this, because the authorization rule is then applied
 * to all the following routes (even in other modules)
 *
 *      app.use(authorize(role.Student));
 *
 */

/**
 * @swagger
 * /student:
 *  get:
 *    tags:
 *      - students
 *    summary: "Get the list of all lectures for a student"
 *    consumes:
 *       - "application/json"
 *    produces:
 *       - "application/json"
 *    responses:
 *       "201":
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

app.get('/students/:student_id/lectures', timeValidator.checkTime, async(req,res) =>{
    const student_id = +req.params.student_id;
    const start_date = req.query.from;
    const end_date = req.query.to;
    try{
        let lectures = await studentService.getStudentLecture(student_id,start_date, end_date);
        return res.status(200).json(lectures);
    } catch(error){
        res.json(error);
    }
})

/**
 * @swagger
 * /students:
 *  get:
 *    tags:
 *      - students
 *    summary: "Assert if a student can book a Lecture"
 *    description: "Assert if a student can book a Lecture"
 *    consumes:
 *       - "application/json"
 *    produces:
 *       - "application/json"
 *    responses:
 *       "201":
 *         description: "Successful response"
 *         schema:
 *           type: "object"
 *           items:
 *             $ref: "#/components/schemas/Lecture"
 *       "400":
 *         description: "Invalid status value"
 *    security:
 *     - petstore_auth:
 *       - "write:pets"
 *       - "read:pets"
 */

app.get('/students/:lecture_id/',authorize(role.Student), async(req,res) =>{
    const lecture_id= req.params.lecture_id;
    const student_id=req.user && req.user.sub;
    try{
        let bool = await bookingService.assertBooking(lecture_id,student_id);
        return res.status(200).json(bool);
    } catch(error){
        res.json(error);
    }
  })

module.exports = app;