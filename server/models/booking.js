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