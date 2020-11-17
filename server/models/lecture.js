/**
 * For swagger data types refer to: https://swagger.io/docs/specification/data-models/data-types/
 * For swagger live editor visit: https://editor.swagger.io/?_ga=2.139478195.1827220927.1604945624-383726330.1604945624
 */


/**
 * @swagger
 *
 * components:
 *  schemas:
 *   Lecture:
 *     type: object
 *     required:
 *       - course_id
 *       - room_id
 *       - datetime
 *     properties:
 *       datetime:
 *         type: string
 *         format: date-time
 *       datetime_end:
 *         type: string
 *         format: date-time
 *       course_id:
 *         type: string
 *         format: byte 
 *       room_id:
 *         type: string
 *         format: byte 
 *       virtual:
 *         type: boolean
 *       deleted_at:
 *         type: string
 *         format: date-time
 */

class Lecture{
    constructor(id,datetime,datetime_end,course_id,room_id,virtual,deleted_at){
            this.id = id;
            this.datetime = datetime;
            this.datetime_end = datetime_end
            this.course_id = course_id;
            this.room_id = room_id;
            this.virtual = virtual;
            if(deleted_at)
                this.deleted_at = deleted_at;
    }
}
module.exports = Lecture;
