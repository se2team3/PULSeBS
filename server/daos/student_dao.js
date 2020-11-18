// import database
// import modules

const db = require('../db/db.js');
const LectureExtended = require('../models/lecture_extended');

//gets the courses given the student_id
exports.retrieveStudentLectures = function(student_id) {
    return new Promise ((resolve,reject) =>{
        // id, datetime,datetime_end,course_id,room_id,virtual,deleted_at,
        // course_name,teacher_name,teacher_surname,room_name,max_seats,booking_counter
        const sql = `SELECT L.id, datetime, course_id, room_id, virtual, L.deleted_at, C.name as course_name,
                            T.name as teacher_name, T.surname as teacher_surname,
                            R.name as room_name, seats as max_seats, COUNT(B.lecture_id) as booking_counter
                     FROM Lectures L, Rooms R, Bookings B, Users T, Courses C
                     WHERE L.id=B.lecture_id AND L.course_id=C.id AND L.room_id= R.id AND C.teacher_id=T.id AND L.course_id IN
                                (SELECT course_id FROM Course_Student WHERE student_id = ?)
                     GROUP BY B.lecture_id`
        db.all(sql, [student_id], (err, rows) => {
            if(err) {
                console.error(err);
                return reject(err);
            }
            if (!rows)
                resolve(null);
            else{
                console.log(`after query`);
                resolve(rows.map(r => new LectureExtended(r)));
            }               
        });
    })
}