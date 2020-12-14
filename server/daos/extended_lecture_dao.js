// import database
// import modules

const db = require('../db/db.js');
const ExtendedLecture = require('../models/lecture_extended');

const createExtendedLecture = function (row){
    return new ExtendedLecture(row);
}

//gets the lecture with the selected id
exports.getLectureById = function(id) {
    return new Promise ((resolve,reject) =>{
        // id, datetime,datetime_end,course_id,room_id,virtual,deleted_at,course_name,teacher_name,teacher_surname,room_name,max_seats,booking_counter
        const sql = `
            SELECT L.id,L.datetime,L.datetime_end,L.course_id,L.room_id,L.virtual, L.deleted_at, C.name as course_name,
                    T.name as teacher_name, T.surname as teacher_surname, R.name as room_name, R.seats as max_seats, COUNT(B.lecture_id) as booking_counter
            FROM Lectures L, Users T, Users U, Courses C,Rooms R, Bookings B
            WHERE L.course_id=C.id AND L.room_id=R.id AND C.teacher_id=T.id AND
            L.id=B.lecture_id AND B.student_id=U.id AND L.id=? AND T.role="teacher" AND U.role="student"
            GROUP BY B.lecture_id
            ORDER BY L.datetime`;
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

//gets the lecture related to the selected teacher id
exports.getLecturesByTeacherId = function(id, from_opt, to_opt) {
    return new Promise ((resolve,reject) =>{
        const sql = `
            SELECT L.id,L.datetime,L.datetime_end,L.course_id,L.room_id,L.virtual, L.deleted_at, C.name as course_name,
                T.name as teacher_name, T.surname as teacher_surname, R.name as room_name, R.seats as max_seats, COUNT(B.lecture_id) as booking_counter
            FROM Lectures L, Users T, Users U, Courses C,Rooms R, Bookings B
            WHERE L.course_id=C.id AND L.room_id=R.id AND C.teacher_id=T.id AND
                L.id=B.lecture_id AND B.student_id=U.id AND T.role="teacher" AND U.role="student"
                AND C.teacher_id = ?
                AND (? IS NULL OR datetime >= ?)
                AND (? IS NULL OR datetime <= ?)
            GROUP BY B.lecture_id
            ORDER BY L.datetime`;
        db.all(sql, [id, from_opt, from_opt, to_opt, to_opt], (err, rows) => {
            if(err)
                return reject(err);
            resolve(rows.map(createExtendedLecture));
        });
    })
}
