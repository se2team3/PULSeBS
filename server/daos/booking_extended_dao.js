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
        if(!(parseInt(lecture_id)==lecture_id)){
            reject("Is not an integer")
        }
        const sql = `
            SELECT  lecture_id, student_id, waiting, present, updated_at, deleted_at,
                    name as student_name, surname as student_surname, university_id as student_university_id
            FROM    Bookings, Users
            WHERE   Bookings.student_id = Users.id AND lecture_id = ?`;
        
        db.all(sql, [lecture_id], (err, rows) => {
            if (!rows)
                resolve(null);
            else{
                const bookings = rows.map((row) => createBookingExtended(row));
                resolve(bookings);
            }               
        });
    })
}
