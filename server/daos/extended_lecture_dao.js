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

        if(parseInt(id)!==id){
            reject("Invalid lecture!")
        }

        const sql = `
            SELECT  L.id, L.datetime, L.datetime_end, L.course_id, L.room_id, L.virtual, L.deleted_at,
                    C.name as course_name,
                    T.name as teacher_name, T.surname as teacher_surname,
                    R.name as room_name, R.seats as max_seats,
                    COUNT(B.lecture_id) as booking_counter
            FROM    Lectures L, Users T, Users U, Courses C,Rooms R
            LEFT JOIN Bookings as B ON B.lecture_id = L.id AND B.student_id=U.id
            WHERE   L.course_id=C.id AND L.room_id=R.id AND C.teacher_id=T.id AND
                    L.id = ? AND T.role="teacher" AND U.role="student"
            GROUP BY B.lecture_id
            ORDER BY L.datetime 
        `;
        db.get(sql, [id], (err, row) => {
           if (!row)
                reject('Not found')
            else{
                const lecture = createExtendedLecture(row);
                resolve(lecture);
            }
        });
    })
}

//gets the lecture with the selected id
exports.getAllLectures = function(start_date,end_date) {
    return new Promise ((resolve,reject) =>{
        // id, datetime,datetime_end,course_id,room_id,virtual,deleted_at,course_name,teacher_name,teacher_surname,room_name,max_seats,booking_counter
        const sql = `
        SELECT L.id,L.datetime,L.datetime_end,L.course_id,L.room_id,L.virtual, L.deleted_at, C.name as course_name,
        T.name as teacher_name, T.surname as teacher_surname, R.name as room_name, R.seats as max_seats,
		(COUNT(case when B.waiting<>1 AND B.deleted_at IS NULL then 1 else null end)) as booking_counter,
		(COUNT(case when B.waiting<>1 AND B.deleted_at IS NOT NULL then 1 else null end)) as cancellation_counter,
		(COUNT(case when B.waiting=1 AND B.deleted_at IS NULL then 1 else null end)) as waiting_counter 
		
		FROM Lectures L, Users T, Users U, Courses C,Rooms R
		LEFT JOIN Bookings B ON L.id=B.lecture_id AND U.id=B.student_id
        WHERE L.course_id=C.id AND L.room_id=R.id AND C.teacher_id=T.id  AND T.role="teacher" AND U.role="student"
         AND (?1 IS NULL OR date(L.datetime) >= ?1)
         AND (?2 IS NULL OR date(L.datetime) <= ?2)
		
        GROUP BY L.id
        ORDER BY L.datetime`;
        db.all(sql, [start_date, end_date], (err, rows) => {
            if (err) {
                reject(err);
            }
            if (!rows) {
                resolve([]);
            }
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
/*exports.getLecturesByTeacherId = function(id, from_opt, to_opt) {
    return new Promise ((resolve,reject) =>{
        const sql = `
            SELECT  L.id, L.datetime, L.datetime_end, L.course_id, L.room_id, L.virtual, L.deleted_at,
                    C.name as course_name,
                    T.name as teacher_name, T.surname as teacher_surname,
                    R.name as room_name, R.seats as max_seats,
                    COUNT(B.lecture_id) as booking_counter
            FROM    Lectures L, Users T, Users U, Courses C, Rooms R
            LEFT JOIN Bookings B ON L.id = B.lecture_id
            WHERE   L.course_id=C.id AND L.room_id=R.id AND C.teacher_id=T.id
                    AND T.role="teacher" AND U.role="student"
                    AND C.teacher_id = ?1
                    AND (?2 IS NULL OR datetime >= ?2)
                    AND (?3 IS NULL OR datetime <= ?3)
            GROUP BY L.id
            ORDER BY L.datetime
            `;
        db.all(sql, [id, from_opt, to_opt], (err, rows) => {
            if(err)
                return reject(err);
            resolve(rows.map(createExtendedLecture));
        });
    })
}*/
