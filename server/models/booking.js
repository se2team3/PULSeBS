/**
 * For swagger data types refer to: https://swagger.io/docs/specification/data-models/data-types/
 * For swagger live editor visit: https://editor.swagger.io/?_ga=2.139478195.1827220927.1604945624-383726330.1604945624
 */


/**
 * @swagger
 *
 * components:
 *  schemas:
 *   Booking:
 *     type: object
 *     required:
 *       - lecture_id
 *       - student_id
 *     properties:
 *       lecture_id:
 *         type: number
 *       student_id:
 *         type: number 
 *       waiting:
 *         type: boolean
 *       present:
 *         type: boolean
 *       updated_at:
 *         type: string
 *         format: date-time
 *       deleted_at:
 *         type: string
 *         format: date-time
 */


class Booking{
    constructor(lecture_id,student_id,waiting,present,updated_at,deleted_at){
            this.lecture_id = lecture_id;
            this.student_id = student_id;
            this.waiting = waiting;
            this.present = present;
            if(updated_at)
                this.updated_at = updated_at;
            if(deleted_at)
                this.deleted_at = deleted_at;
    }
}
module.exports = Booking;