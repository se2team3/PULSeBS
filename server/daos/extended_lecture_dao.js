// import database
// import modules

const db = require('../db/db.js');
const ExtendedLecture = require('../models/extended_lecture');

const createExtendedLecture = function (row){
    return new ExtendedLecture(row.id,row.datetime,row.course_id,row.room_id,row.virtual,row.deleted_at,null, //null is for row.datetime_end,
                                row.course_name, row.teacher_name,row.teacher_surname,row.room_name,row.max_seats,row.booking_counter);
}

//gets the lecture with the selected id
exports.getLectureById = function(id) {
    return new Promise ((resolve,reject) =>{
        const sql = `SELECT L.id,L.datetime,L.course_id,L.room_id,L.virtual, L.deleted_at, C.name,T.name, T.surname,R.name, R.seats, COUNT(B.lecture_id)
                     FROM Lectures L, Users T, Users U, Courses C,Rooms R, Bookings B
                     WHERE L.course_id=C.id AND L.room_id=R.id AND C.teacher_id=T.id AND
                     L.id=B.lecture_id AND B.student_id=U.id AND L.id=? AND T.role="teacher" AND U.role="student"
                     GROUP BY B.lecture_id`
        db.get(sql, [id], (err, row) => {
            if(err)
                return reject(err);
            if (!row)
                resolve(null);
            else{
                const lecture = createExtendedLecture(row);
                resolve(lecture);
            }               
        });
    })
}