// import database
// import modules

const db = require('../db/db.js');
const Booking = require('../models/booking.js');

const createBooking = function (lecture_id, student_id, waiting) {
    return new Booking(lecture_id, student_id, waiting);
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
exports.insertBooking = async function ({ lecture_id, student_id }) {
    return new Promise((resolve, reject) => {

        // First check if the student has already booked for this lecture
        let alreadyBookedQyery  =  `
        SELECT *
        FROM Bookings B
        WHERE lecture_id = ? AND student_id = ? AND deleted_at IS NULL
    `;
        db.get(alreadyBookedQyery,[lecture_id,student_id],function(err0,row0){
            if(row0 || err0){
                reject(Error('Already booked'));
            }else{
                const sql = `
                SELECT COUNT(*) >= R.seats is not null and COUNT(*) >= R.seats as waiting
                FROM Bookings B, Lectures L, Rooms R
                WHERE B.lecture_id = L.id AND L.room_id = R.id AND B.lecture_id = ?1 
                    AND B.deleted_at IS NULL AND B.waiting = 0
            `;
            db.get(sql, [lecture_id], function (err1, row)  {
                const { waiting } = row;
                const sql2 = `
                    INSERT INTO Bookings(lecture_id, student_id, waiting)
                    VALUES(?1, ?2, ?3)
                `;
                db.run(sql2, [lecture_id, student_id, waiting], function (err2) {
                    if (err2) {
                        // TODO: check that updated_at is actually updated
                        const sql3 = `
                          UPDATE Bookings
                          SET deleted_at = NULL, waiting = ?3
                          WHERE lecture_id = ?1 AND student_id = ?2
                        `;
                        db.run(sql3, [ lecture_id, student_id, waiting], function (err3) {
                            if (err3 || this.changes===0) {
                                reject(err3);
                            }
                            else{
                                const booking = createBooking(lecture_id, student_id, !!waiting);
                                resolve(booking);
                            }
                        });
                    }
                    else {
                        const booking = createBooking(lecture_id, student_id, !!waiting);
                        resolve(booking);
                    }
                });
            });
            }
        });

        
        

    })
}

//it moves the first waiting student to the booked list
exports.removeFromWaitingList = async function ({ lecture_id, student_id }) {
    return new Promise((resolve, reject) => {
        const sql = `
          UPDATE Bookings
          SET deleted_at = NULL, waiting = 0
          WHERE lecture_id = ?1 AND student_id = ?2
        `;
        db.run(sql, [lecture_id, student_id], (err) => {
            if (err || this.changes===0)
                return reject(err);
            resolve(createBooking(lecture_id, student_id, false))
        });
    });
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


/*exports.bulkBookings = function(array){
    let factor_stud= 5; //only 1 student over 5 (of type A) is cancelling some of his bookings
    let factor;
    return new Promise ((resolve,reject) =>{
        let sql=''; 
        for (let i = 0; i < array.length; i++) {
            if (array[i].to_be_canc===1){
                factor= factor_stud/(factor_stud-1)
            }
            else if(array[i].to_be_canc===2){
                factor=(2*factor_stud)/(2*factor_stud-1)
            }
            else factor=1;

            sql += `INSERT INTO Bookings(lecture_id,student_id,waiting) 
                    SELECT'${array[i].lecture_id}','${array[i].student_id}', (COUNT(*) >= R.seats is not null and COUNT(*) >= (${factor}*R.seats))
                    FROM Bookings B, Lectures L, Rooms R
                    WHERE B.lecture_id = L.id AND L.room_id = R.id AND B.lecture_id =  '${array[i].lecture_id}'
                    AND B.deleted_at IS NULL AND B.waiting = 0; `
        }
        db.exec("BEGIN TRANSACTION; "+ sql + " COMMIT;",(err) => {
            if(err)
                reject(err);
            else resolve (this.changes)
        })    
    });
}

exports.bulkDeletions = function(array){
    return new Promise ((resolve,reject) =>{
        let sql='';
        for (let i = 0; i < array.length; i++) {
            sql += `UPDATE Bookings SET deleted_at='${array[i].datetime}'
            WHERE lecture_id='${array[i].lecture_id}' AND student_id='${array[i].student_id}'; `
        }
        db.exec("BEGIN TRANSACTION; "+ sql + " COMMIT;",(err) => {
            if(err)
                reject(err);
            else
                resolve(this.changes)
        })    
    });
} */