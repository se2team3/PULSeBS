const e = require('express');
const db = require('../db/db');

exports.getLecturesByTeacherAndTime = function(teacher_id,start_date, end_date) {
    console.log('', { start_date, end_date })
    return new Promise((resolve,reject) => {

        const sql = `SELECT L.id, datetime, course_id, room_id, virtual, L.deleted_at, C.name as course_name,
        T.name as teacher_name, T.surname as teacher_surname,
        R.name as room_name, seats as max_seats, COUNT(B.lecture_id) as booking_counter
 FROM Lectures L, Rooms R, Bookings B, Users T, Courses C
 WHERE L.id=B.lecture_id AND L.course_id=C.id AND L.room_id= R.id AND C.teacher_id = T.id AND C.teacher_id = ?1
        AND (?2 IS NULL OR date(L.datetime) >= ?2)
        AND (?3 IS NULL OR date(L.datetime) <= ?3)
 GROUP BY B.lecture_id
 ORDER BY L.datetime`;

        db.all(sql, [teacher_id, start_date, end_date], (err, rows) => {
            if(err){
                reject(err);
            }
            else{
                console.log(`rows`, rows);
                resolve(rows);
            }               
        });
    });
}