// import database
// import modules

const db = require('../db/db.js');
const Booking = require('../models/booking.js');

const createBooking = function (row){
    return new Booking(row.lecture_id,row.student_id,row.waiting,row.present,row.updated_at,row.deleted_at);
}

// it creates the booking table
exports.createBookingTable = function() {
    return new Promise ((resolve,reject) => {
        const sql = `CREATE TABLE Bookings (lecture_id TEXT NOT NULL, student_id TEXT NOT NULL,
                     waiting BOOLEAN NOT NULL DEFAULT (0) CHECK (waiting IN (0,1)),
                     present BOOLEAN NOT NULL DEFAULT (0) CHECK (present IN (0,1)),
                     updated_at TEXT,deleted_at TEXT, PRIMARY KEY(lecture_id,student_id),
                     FOREIGN KEY(lecture_id) REFERENCES Lectures(id), FOREIGN KEY(student_id) REFERENCES Users(id))`
        db.run(sql,[],(err) =>{
            if(err)
                reject(err);
            else
                resolve(null);
        });
    })
}
//it allows you to insert a new booking
exports.insertBooking = function({lecture_id,student_id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Bookings(lecture_id,student_id) VALUES(?,?)'
        db.run(sql,[lecture_id,student_id],(err) =>{
            if(err)
                reject(err);
            else
                resolve(null);   
        });
    })
}

//gets the bookings given the student_id
exports.retrieveStudentBookings = function({student_id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT lecture_id FROM Bookings WHERE student_id = ?'
        db.all(sql, [student_id], (err, rows) => {
            if(err)
                return reject(err);
            if (!rows)
                resolve(null);
            else{
                resolve(rows);
            }               
        });
    })
}
//gets the bookings given the lecture_id
exports.retrieveLectureBookings = function({lecture_id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT * FROM Bookings WHERE lecture_id = ?'
        db.all(sql, [lecture_id], (err, rows) => {
            if(err)
                return reject(err);
            if (!rows)
                resolve(null);
            else{
                const bookings = rows.map((row) => createBooking(row));
                resolve(bookings);
            }               
        });
    })
}