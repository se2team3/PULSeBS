const db = require('../db/db.js');

// it creates the lecture table
exports.createLectureTable = function() {
    return new Promise ((resolve,reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS Lectures (id INTEGER NOT NULL PRIMARY KEY, datetime TEXT, datetime_end TEXT, course_id INTEGER NOT NULL,
                     room_id INTEGER NOT NULL, virtual INTEGER NOT NULL DEFAULT (0) CHECK (virtual IN (0,1)),
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
exports.insertLecture = function({datetime,datetime_end,course_id,room_id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Lectures(datetime,datetime_end,course_id,room_id) VALUES(?,?,?,?)'
        db.run(sql,[datetime,datetime_end,course_id,room_id],function(err) {
            if(err)
                reject(err);
            else
                resolve(this.lastID);   
        });
    })
}

exports.deleteLectureTable = function() {
    return new Promise ((resolve,reject) =>{
        const sql = 'DROP TABLE Lectures '
        db.run(sql, (err, row) => {
            if(err)
                return reject(err);
            else resolve(null);
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
        WHERE   strftime('%Y-%m-%d',Lectures.datetime) = date('now', ?) AND
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

//get the list of all lectures for a course
exports.getLectures = function(course_id) {
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT * FROM Lectures WHERE course_id = ?'
        db.all(sql, [course_id], (err, rows) => {
            if(err)
                return reject(err);
            if (!rows)
                resolve(null);
            else{
                resolve(rows);
            }               
        });
    })
};

exports.getWaitingStudents = function(lecture_id) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT student_id
            FROM Bookings B
            WHERE waiting = 1 AND B.lecture_id = ? AND B.deleted_at IS NULL
            ORDER BY B.updated_at
        `;
        db.all(sql, [lecture_id], (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows.map(r => r.student_id));
        });
    });
}

exports.deleteLecture = function ({ datetime, lecture_id,teacher}) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE Lectures SET deleted_at= ? 
                     WHERE id= ? AND deleted_at IS NULL
                    AND (julianday(datetime)-julianday(?))*24 >1
                    AND id in (SELECT L2.id FROM Lectures L2, Courses C, Users U
                               WHERE  L2.course_id=C.id AND C.teacher_id=U.id AND U.role='teacher' AND U.id=? )`
        db.run(sql, [datetime,lecture_id,datetime,teacher], function(err) {
            if (err) {
                reject(err);
            }
            else{
                resolve(this.changes);
            }
        }); 
      
    })
}
exports.setLectureVirtual = function ({ datetime, lecture_id,teacher}) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE Lectures SET virtual= 1
                     WHERE id= ? AND deleted_at IS NULL AND virtual=0
                     AND (julianday(datetime)-julianday(?))*24*60 >30
                     AND id in (SELECT L2.id FROM Lectures L2, Courses C, Users U
                                WHERE  L2.course_id=C.id AND C.teacher_id=U.id AND U.role='teacher' AND U.id=? )`
        db.run(sql, [lecture_id,datetime,teacher], function(err) {
            if (err) {
                reject(err);
            }
            else{
                resolve(this.changes);
            }
        }); 
      
    })
}


exports.bulkInsertionLectures = function(array){
    return new Promise ((resolve,reject) =>{
        let sql='';
    for (let i = 0; i < array.length; i++) {
        //'INSERT INTO Lectures(datetime,datetime_end,course_id,room_id) VALUES(?,?,?,?)'
             
        sql += `INSERT INTO Lectures(datetime,datetime_end,course_id,room_id) 
        VALUES("${array[i].datetime}","${array[i].datetime_end}",${array[i].course_id},${array[i].room_id}); `
    }
    db.exec("BEGIN TRANSACTION; "+ sql + " COMMIT;",(err) => {
        if(err)
            reject(err);
        else
            resolve();
    })    
    });
}

exports.isEmpty = function(){
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT COUNT(*) as n FROM Lectures'
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