// import database
// import modules

const db = require('../db/db.js');
const Lecture = require('../models/lecture.js');

const createLecture = function (row){
    return new Course(row.id,row.datetime,row.course_id,row.room_id,row.virtual,row.deleted_at);
}

// it creates the lecture table
exports.createLectureTable = function() {
    return new Promise ((resolve,reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS Lectures (id INTEGER NOT NULL PRIMARY KEY, datetime TEXT, course_id TEXT NOT NULL,
                     room_id INTEGER NOT NULL, virtual BOOLEAN NOT NULL DEFAULT (0) CHECK (virtual IN (0,1)),
                     deleted_at TEXT, FOREIGN KEY(course_id) REFERENCES Courses(id), FOREIGN KEY(room_id) REFERENCES Rooms(id))`
        db.run(sql,[],(err) =>{
            if(err)
                reject(err);
            else
                resolve(null);
        });
    })
}

//clears the lecture table
exports.clearLectureTable = function () {
    return new Promise ((resolve,reject) =>{
        const sql = 'DELETE FROM Lectures';
        db.run(sql,[],(err) =>{
            if(err)
                reject(err);
            else
                resolve();
        });
    })
}

//it allows you to insert a new lecture
exports.insertLecture = function({datetime,course_id,room_id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Lectures(datetime,course_id,room_id) VALUES(?,?,?)'
        db.run(sql,[datetime,course_id,room_id],function(err) {
            if(err)
                reject(err);
            else
                resolve(this.lastID);   
        });
    })
}
//gets the lecture with the selected id
exports.retrieveLecture = function({id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT * FROM Lectures WHERE id = ?'
        db.get(sql, [id], (err, row) => {
            if(err)
                return reject(err);
            if (!row)
                resolve(null);
            else{
                const lecture = createLecture(row);
                resolve(lecture);
            }               
        });
    })
}

//gets info about next day lessons
exports.retrieveNextDayLectures = function({offset}) {
    offset = `+${offset} day`;
    return new Promise ((resolve,reject) =>{
        const sql = `
        SELECT  Courses.name as course_name, Courses.code,
                Users.name as teacher_name, Users.surname as teacher_surname, Users.email,
                Lectures.datetime as date, count(*) as n_booked, Lectures.room_id as room
        FROM    Bookings, Lectures, Courses, Users
        WHERE   Lectures.datetime = date('now', ?)   AND
                Bookings.lecture_id = Lectures.id           AND
                Lectures.course_id = Courses.id             AND
                Users.id = Courses.teacher_id
        GROUP BY
                Bookings.lecture_id,
                Lectures.course_id, Lectures.datetime, Lectures.room_id,
                Courses.name, Courses.code,
                Users.name, Users.surname, Users.email`
        ;
        db.all(sql, [offset], (err, rows) => {
            if(err)
                return reject(err);
            resolve(lectureInfo(rows));
        });
    })
}

const lectureInfo = (rows) => {
    return rows.map(row => ({
        teacher: {
            name: row.teacher_name,
            surname: row.teacher_surname,
            email: row.email
        },
        course: {
            name: row.course_name,
            code: row.code
        },
        date: row.date,
        room: row.room,
        bookings: row.n_booked
    }));
};
