const Lecture=require('./lecture')

class LectureExtended extends Lecture{
    constructor({id, datetime,datetime_end,course_id,room_id,virtual,deleted_at,course_name,
                    teacher_name,teacher_surname,room_name,max_seats,booking_counter,waiting_counter,
                    waiting_list_pos,booking_updated_at,booking_waiting,present,cancellation_counter}){
        super (id,datetime,datetime_end,course_id,room_id,virtual,deleted_at);
        this.course_name=course_name;
        this.teacher_name=teacher_name;
        this.teacher_surname=teacher_surname;
        this.room_name=room_name;
        this.max_seats=max_seats;
        this.booking_counter=booking_counter;
        this.waiting_counter=Object.is(waiting_counter, undefined) ? 0 : waiting_counter;
        this.waiting_list_pos=waiting_list_pos;
        if (booking_updated_at) {
            this.booking_updated_at = booking_updated_at;
            this.booking_waiting = !!booking_waiting;
            this.present = !!present;
        }
        this.cancellation_counter = cancellation_counter;  
    }
}
module.exports = LectureExtended;
