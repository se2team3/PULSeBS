const e = require('express');
const db = require('../db/db');

exports.getLecturesByTeacherAndTime = function(teacher_id,start_date, end_date) {

    return new Promise((resolve,reject) => {

        let value = isNaN(teacher_id) ? 0 : parseInt(teacher_id)


        if(!value){
            reject("wrong parameters")
        }


        const sql = `SELECT L.id, datetime, course_id, room_id, virtual, L.deleted_at, C.name as course_name,
        T.name as teacher_name, T.surname as teacher_surname,
        R.name as room_name, seats as max_seats, COUNT(B.lecture_id) as booking_counter
 FROM Lectures L, Rooms R, Users T, Courses C
 LEFT JOIN Bookings B ON L.id = B.lecture_id
 WHERE L.course_id=C.id AND L.room_id= R.id AND C.teacher_id = T.id AND C.teacher_id = ? AND date(L.datetime) <= ? AND date(L.datetime) >= ?
 GROUP BY L.id`
 
        /* const sql = `SELECT * 
        FROM Lectures L, Users U, Courses C 
        WHERE L.course_id = C.id AND C.teacher_id = U.id
            AND U.role = "teacher"
            AND C.teacher_id = ? AND L.datetime <= ? AND L.datetime >= ?`; */

        db.all(sql, [teacher_id, end_date, start_date], (err, rows) => {
            resolve(rows);            
        });
    });
}