// import database
// import modules

const db = require('../db/db.js');
const BookingExtended = require('../models/booking_extended');

const createBookingExtended = function ({lecture_id,student_id,waiting,present,updated_at,deleted_at, student_university_id, student_name, student_surname}){
    return new BookingExtended(lecture_id,student_id,waiting,present,updated_at,deleted_at, student_university_id, student_name, student_surname);
}

//gets the bookings given the lecture_id
exports.retrieveLectureBookings = function(lecture_id) {
    return new Promise ((resolve,reject) =>{
        const sql = `
            SELECT  lecture_id, student_id, waiting, present, updated_at, deleted_at,
                    name as student_name, surname as student_surname, university_id as student_university_id
            FROM    Bookings, Users
            WHERE   Bookings.student_id = Users.id AND lecture_id = ?`;
        db.all(sql, [lecture_id], (err, rows) => {
            if(err)
                return reject(err);
            if (!rows)
                resolve(null);
            else{
                const bookings = rows.map((row) => createBookingExtended(row));
                resolve(bookings);
            }               
        });
    })
}


//gets the bookings given the teacher_id
/*exports.retrieveTeacherBookings = function(teacher_id) {
    return new Promise ((resolve,reject) =>{
        const sql = `
            SELECT  B.lecture_id, student_id, waiting, present, updated_at, B.deleted_at as booking_deleted,
                    L.deleted_at as lecture_deleted, L.datetime as lecture_start, L.datetime_end as lecture_end, virtual,
                    C.code as course_code, C.name as course_name, C.id as course_id
            FROM    Bookings as B, Lectures as L, Courses as C
            WHERE   B.lecture_id = L.id AND L.course_id = C.id AND C.teacher_id = ?`;
        db.all(sql, [teacher_id], (err, rows) => {
            if(err)
                return reject(err);
            if (!rows)
                resolve(null);
            else{
                //const bookings = rows.map((row) => createBookingExtended(row));
                //resolve(bookings);
                resolve(rows);
            }
        });
    })
}*/