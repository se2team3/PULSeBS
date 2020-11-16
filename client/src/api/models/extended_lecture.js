const Lecture=require('./lecture')
/**
 * For swagger data types refer to: https://swagger.io/docs/specification/data-models/data-types/
 * For swagger live editor visit: https://editor.swagger.io/?_ga=2.139478195.1827220927.1604945624-383726330.1604945624
 */


/**
 * @swagger
 *
 * components:
 *  schemas:
 *   ExtendedLecture:
 *     type: object
 *     required:
 *       - course_id
 *       - room_id
 *       - datetime
 *     properties:
 *       date_time:
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
 *       datetime_end:
 *         type: string
 *         format: date-time
 *       course_name:
 *          type: string
 *          format:byte
 *       teacher_name:
 *          type: string
 *          format:byte
 *       teacher_surname:
 *          type: string
 *          format:byte
 *       room_name:
 *          type: string
 *          format:byte
 *       available_seats:
 *          type: number
 *          format:integer
 *       bookable:
 *          type: string
 *          format:byte
 */

class ExtendedLecture extends Lecture{
    constructor(id,datetime,course_id,room_id,virtual,deleted_at,datetime_end,course_name,teacher_name,teacher_surname,room_name,available_seats,bookable){
        super (id,datetime,course_id,room_id,virtual,deleted_at)
        this.datetime_end=datetime_end
        this.course_name=course_name;
        this.teacher_name=teacher_name;
        this.teacher_surname=teacher_surname;
        this.room_name=room_name;
        this.available_seats=available_seats;  
        this.bookable=bookable; 
    }
}
module.exports = ExtendedLecture;
