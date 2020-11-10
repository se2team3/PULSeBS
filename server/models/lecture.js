class Lecture{
    constructor(id,datetime,course_id,room_id,virtual,deleted_at){
            this.id = id;
            this.datetime = datetime;
            this.course_id = course_id;
            this.room_id = room_id;
            this.virtual = virtual;
            if(deleted_at)
                this.deleted_at = deleted_at;
    }
}
module.exports = Lecture;