// import database
// import modules


const db = require('../db/db.js');
const LectureExtended = require('../models/lecture_extended');


//gets the extendedLecture given the student_id and a time frame
exports.retrieveStudentLecturesinTimeFrame = function(student_id,start_date, end_date) {
    return new Promise ((resolve,reject) =>{
        
       if(parseInt(student_id)!==student_id){
            reject("wrong parameters")
        }
        
        const sql = `
          SELECT L.id, datetime, datetime_end, course_id, room_id, virtual, L.deleted_at, C.name as course_name,
              T.name as teacher_name, T.surname as teacher_surname,
              R.name as room_name, seats as max_seats, COUNT(B.lecture_id) as booking_counter,
              B2.updated_at as booking_updated_at, B2.waiting as booking_waiting, B2.present
          FROM Lectures L, Rooms R, Users T, Courses C
          LEFT JOIN Bookings B2 ON B2.student_id = ?1 AND L.id = B2.lecture_id AND B2.deleted_at IS NULL
          LEFT JOIN Bookings B ON L.id = B.lecture_id
          WHERE L.course_id=C.id AND L.room_id= R.id AND C.teacher_id=T.id
            AND date(L.datetime) >= ?2 AND date(L.datetime) <= ?3
            AND L.course_id IN
              (SELECT course_id FROM Course_Student WHERE student_id = ?1)
          GROUP BY (L.id)
        `;
        db.all(sql, [student_id, start_date, end_date], (err, rows) => {
            if (!rows)
                resolve({});
            else{
                resolve(rows.map(r => new LectureExtended(r)));
            }               
        });
    })
}