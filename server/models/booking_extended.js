const Booking = require('./booking')

class BookingExtended extends Booking{
    constructor(lecture_id,student_id,waiting,present,updated_at,deleted_at, student_university_id, student_name, student_surname){
        super(lecture_id, student_id, waiting, present, updated_at, deleted_at)
        this.student_university_id = student_university_id;
        this.student_name = student_name;
        this.student_surname = student_surname;
    }
}
module.exports = BookingExtended;