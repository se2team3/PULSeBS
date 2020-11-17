// import database
// import modules

const db = require('../db/db.js');

//gets the courses given the student_id
exports.retrieveStudentLecture = function(student_id) {
    return new Promise ((resolve,reject) =>{
        const sql = `SELECT *, COUNT(B.lecture_id)
                     FROM Lectures L, Rooms R, Bookings B, Users T, Courses C
                     WHERE L.id=B.lecture_id AND L.course_id=C.id AND L.room_id= R.id AND C.teacher_id=T.id AND L.course_id IN
                                (SELECT course_id FROM Course_Student WHERE student_id = ?)
                     GROUP BY B.lecture_id`
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