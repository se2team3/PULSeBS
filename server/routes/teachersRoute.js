const express = require('express');
const router = express.Router();
const teacherService = require('../services/teachersService');
const authorize = require('../services/authorizeService');
const role = require('../utils/roles');
const timeValidator = require('../validators/timeValidator')

/**
 * @swagger
 * /teachers/:teacher_id/lectures:
 *  get:
 *    tags:
 *      - teachers
 *    summary: "Get the list of all lectures for a teacher in a time frame "
 *    #description: "Use to request all the lectures"
 *    parameters:
 *      - in: path
 *        name: lecture_id
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *      - in: query
 *        name: start_date
 *        schema:
 *          type: string
 *          format: date-time
 *        required: true
 *      - in: query
 *        name: end_date
 *        schema:
 *          type: string
 *          format: date-time
 *        required: true
 *    consumes:
 *       - "application/json"
 *    produces:
 *       - "application/json"
 *    responses:
 *       "200":
 *         description: "Successful response"
 *         content:
 *          application/json:
 *           schema:
 *             type: "array"
 *             items:
 *               $ref: "#/components/schemas/ExtendedLecture"
 #*             example:   # Sample object
 #*               date_time: November 13th 2020, 6:16:36 pm
 #*               course_id: 01SQNOV
 #*               room_id: 12
 #*               virtual:	boolean
 #*               deleted_at:	string($date-time)
 #*               room_name:	string($byte)
 #*               bookings: 123
 *       "400":
 *         description: "Invalid status value"
 *       "500":
 *         description: "Internal server error"
 */


router.get('/teachers/:teacher_id/lectures',timeValidator.checkTime, async (req, res) => {

    const teacher_id = req.params.teacher_id;
    const start_date = req.query.from;
    const end_date = req.query.to;

    try {
        let lectures = await teacherService.getLecturesByTeacherAndTime(teacher_id, start_date, end_date);
        //console.log(lectures);
        return res.status(200).json(lectures);
    } catch (error) {
        res.status(400).json(error);
    }

});

module.exports = router;