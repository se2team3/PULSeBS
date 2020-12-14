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
                    T.name as teacher_name, T.surname as teacher_surname, R.name as room_name, R.seats as max_seats, COUNT(B.lecture_id) as booking_counter,
                    (SELECT COUNT(*) FROM Bookings B2 WHERE B2.lecture_id=? AND deleted_at IS NOT NULL) as cancellations
            FROM Lectures L, Users T, Users U, Courses C,Rooms R, Bookings B
            WHERE L.course_id=C.id AND L.room_id=R.id AND C.teacher_id=T.id AND
            L.id=B.lecture_id AND B.student_id=U.id AND L.id=? AND T.role="teacher" AND U.role="student"
            GROUP BY B.lecture_id
            ORDER BY datetime`;
        db.get(sql, [id,id], (err, row) => {
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

//gets the lecture with the selected id
exports.getAllLectures = function(opt_start_date, opt_end_date) {
    return new Promise ((resolve,reject) =>{
        // id, datetime,datetime_end,course_id,room_id,virtual,deleted_at,course_name,teacher_name,teacher_surname,room_name,max_seats,booking_counter
        const sql = `
        SELECT L.id,L.datetime,L.datetime_end,L.course_id,L.room_id,L.virtual, L.deleted_at, C.name as course_name,
        T.name as teacher_name, T.surname as teacher_surname, R.name as room_name, R.seats as max_seats, COUNT(B.lecture_id) as booking_counter, t.cancellation_counter           
        FROM 
			(SELECT lecture_id , COUNT(B1.deleted_at) as cancellation_counter FROM Lectures L1, Users T1, Users U1, Courses C1,Rooms R1, Bookings B1
                WHERE L1.course_id=C1.id AND L1.room_id=R1.id AND C1.teacher_id=T1.id AND
                L1.id=B1.lecture_id AND B1.student_id=U1.id AND T1.role="teacher" AND U1.role="student" 
                GROUP BY L1.id
            ) as t, 
		Lectures L, Users T, Users U, Courses C,Rooms R, Bookings B
        WHERE L.course_id=C.id AND L.room_id=R.id AND C.teacher_id=T.id  AND  L.id =t.lecture_id AND
         L.id=B.lecture_id AND B.student_id=U.id AND T.role="teacher" AND U.role="student"
         AND (?1 IS NULL OR datetime >= ?1)
         AND (?2 IS NULL OR datetime <= ?2)
        GROUP BY B.lecture_id
        ORDER BY L.datetime`;
        db.all(sql, [opt_start_date, opt_end_date], (err, rows) => {
            if (!rows)                          
                resolve([]);
            else{
                let results=[];
                
                rows.map((row) => {
                    let lecture = createExtendedLecture(row);
                    results.push(lecture);
                })
             
                resolve(results);
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
                AND (?2 IS NULL OR datetime >= ?2)
                AND (?3 IS NULL OR datetime <= ?3)
            GROUP BY B.lecture_id
            ORDER BY datetime`;
        db.all(sql, [id, from_opt, to_opt], (err, rows) => {
            if(err)
                return reject(err);
            resolve(rows.map(createExtendedLecture));
        });
    })
}
