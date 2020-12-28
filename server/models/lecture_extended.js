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
 *   LectureExtended:
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
 *          format: byte
 *       teacher_name:
 *          type: string
 *          format: byte
 *       teacher_surname:
 *          type: string
 *          format: byte
 *       room_name:
 *          type: string
 *          format: byte
 *       max_seats:
 *          type: number
 *          format: integer
 *       booking_counter:
 *          type: number
 *          format: integer
 *       cancellation_counter:
 *          type: number
 *          format: integer
 */

class LectureExtended extends Lecture{
    constructor({id, datetime,datetime_end,course_id,room_id,virtual,deleted_at,course_name,
                    teacher_name,teacher_surname,room_name,max_seats,booking_counter,waiting_counter,
                    booking_updated_at,booking_waiting,present,cancellation_counter}){
        super (id,datetime,datetime_end,course_id,room_id,virtual,deleted_at);
        this.course_name=course_name;
        this.teacher_name=teacher_name;
        this.teacher_surname=teacher_surname;
        this.room_name=room_name;
        this.max_seats=max_seats;
        this.booking_counter=booking_counter;
        this.waiting_counter=waiting_counter || 0;
        this.cancellation_counter=cancellation_counter;
        if (booking_updated_at) {
            this.booking_updated_at = booking_updated_at;
            this.booking_waiting = !!booking_waiting;
            this.present = !!present;
        }
    }
}
module.exports = LectureExtended;
