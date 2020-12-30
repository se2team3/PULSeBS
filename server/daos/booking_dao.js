// import database
// import modules

const db = require('../db/db.js');
const Booking = require('../models/booking.js');

const createBooking = function (lecture_id, student_id) {
    return new Booking(lecture_id, student_id);
}

// it creates the booking table
exports.createBookingTable = function () {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS Bookings (lecture_id INTEGER NOT NULL, student_id INTEGER NOT NULL,
                     waiting INTEGER NOT NULL DEFAULT (0) CHECK (waiting IN (0,1)),
                     present INTEGER NOT NULL DEFAULT (0) CHECK (present IN (0,1)),
                     updated_at TEXT DEFAULT(datetime('now','localtime')),deleted_at TEXT, PRIMARY KEY(lecture_id,student_id),
                     FOREIGN KEY(lecture_id) REFERENCES Lectures(id), FOREIGN KEY(student_id) REFERENCES Users(id))`
        db.run(sql, [], (err) => {
            if (err)
                reject(err);
            else
                resolve(null);
        });
    })
}

//clears the booking table
exports.clearBookingTable = function () {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Bookings';
        db.run(sql, [], (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    })
}


//it allows you to insert a new booking
exports.insertBooking = function ({ lecture_id, student_id }) {
    return new Promise((resolve, reject) => {
        const sql = `
        INSERT INTO Bookings(lecture_id, student_id, waiting)
        VALUES(
            ?1,
            ?2,
            (SELECT COUNT(*) >= R.seats is not null and COUNT(*) >= R.seats
             FROM Bookings B, Lectures L, Rooms R
             WHERE B.lecture_id = L.id AND L.room_id = R.id AND B.lecture_id = ?1)
         )
        `;
        db.run(sql, [lecture_id, student_id], function (err) {
            if (err) {
                // TODO: check that updated_at is actually updated
                const sql2 = `
                  UPDATE Bookings
                  SET   deleted_at = NULL AND
                        waiting = (SELECT COUNT(*) >= R.seats is not null and COUNT(*) >= R.seats
                                  FROM Bookings B, Lectures L, Rooms R
                                  WHERE B.lecture_id = L.id AND L.room_id = R.id AND B.lecture_id = ?1)
                  WHERE lecture_id = ?1 AND student_id = ?2 AND deleted_at IS NOT NULL
                `;
                db.run(sql2, [ lecture_id, student_id], function (err2) {
                    if (err2 || this.changes===0) {
                        reject(err2);
                    }
                    else{
                        const booking = createBooking(lecture_id, student_id);
                        resolve(booking);
                    }
                });
            }
            else {
                const booking = createBooking(lecture_id, student_id);
                resolve(booking);
            }
        });
    })
}
/*
//gets the bookings given the student_id
exports.retrieveStudentBookings = function (student_id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT lecture_id FROM Bookings WHERE student_id = ? AND deleted_at IS NULL'
        db.all(sql, [student_id], (err, rows) => {
            if (err)
                return reject(err);
            if (!rows)
                resolve(null);
            else {
                resolve(rows);
            }
        });
    })
}
//gets the bookings given the lecture_id
exports.retrieveLectureBookings = function (lecture_id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Bookings WHERE lecture_id = ? AND deleted_at IS NULL'
        db.all(sql, [lecture_id], (err, rows) => {
            if (err)
                return reject(err);
            if (!rows)
                resolve(null);
            else {
                const bookings = rows.map((row) => createBooking(row));
                resolve(bookings);
            }
        });
    })
}*/

//assert if a student can book a lecture
exports.isBookable = function (student_id, lecture_id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Bookings B WHERE student_id = ? AND lecture_id=?'
        db.all(sql, [student_id, lecture_id], (err, rows) => {
            if (err)
                return reject(err);
            if (!rows.length)
                resolve({ bookable: true });
            else {
                resolve({ bookable: false });
            }
        });
    })
}

/*
exports.deleteBookingTable = function () {
    return new Promise((resolve, reject) => {
        const sql = 'DROP TABLE Bookings '
        db.run(sql, (err, row) => {
            if (err)
                return reject(err);
            else resolve(null);
        });
    })
}
*/
//gets the students booked for a given lecture
exports.retrieveListOfBookedStudents = function(lecture_id) {
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT U.* FROM Bookings B, Users U WHERE B.lecture_id = ? AND U.id = B.student_id'
        db.all(sql, [lecture_id], (err, rows) => {
            if(err)
                return reject(err);
            if (!rows)
                resolve([]);
            else{
                resolve(rows);
            }
        });
})}          

//it allows you to delete a booking
exports.deleteBooking = function ({ datetime, lecture_id, student_id }) {
    return new Promise((resolve, reject) => {

        const sql = 'UPDATE Bookings SET deleted_at= ? WHERE lecture_id= ? AND student_id= ? AND deleted_at IS NULL'
        db.run(sql, [datetime, lecture_id, student_id], function (err) {
            if (err) {
                console.log(err)
                reject(err);
            }
            else
                resolve(this.changes);

        });
    })
}

exports.isEmpty = function(){
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT COUNT(*) as n FROM Bookings'
        db.get(sql, [], (err, row) => {
            if(err)
                return reject(err);
            if (!row)
                resolve(null);
            else{
                resolve(row.n === 0);
            }
        });
    });
}