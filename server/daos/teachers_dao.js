const db = require('../db/db');

exports.getLecturesByTeacherAndTime = function(teacher_id,start_date, end_date) {
    return new Promise((resolve,reject) => {
        const sql = `SELECT * 
        FROM Lectures L, Users U, Courses C 
        WHERE L.course_id = C.id AND C.teacher_id = U.university_id
            AND U.role = "teacher"
            AND C.teacher_id = ? AND L.datetime BETWEEN ? AND  ?`;

        db.all(sql, [teacher_id, start_date, end_date], (err, rows) => {
            if(err)
                reject(err);
            else{
                //const lectures = rows.map((r) => (r));
                resolve(rows);
            }               
        });
    });
}