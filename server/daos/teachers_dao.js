const e = require('express');
const db = require('../db/db');

exports.getLecturesByTeacherAndTime = function(teacher_id,start_date, end_date) {

    console.log (teacher_id + start_date + end_date);
    return new Promise((resolve,reject) => {
        const sql = `SELECT * 
        FROM Lectures L, Users U, Courses C 
        WHERE L.course_id = C.id AND C.teacher_id = U.university_id
            AND U.role = "teacher"
            AND C.teacher_id = ? AND L.datetime <= ? AND L.datetime >= ?`;

        db.all(sql, [teacher_id, start_date, end_date], (err, rows) => {
            if(err)
                reject(err);
            else{
                console.log('SERVICE LECTURES: '+ rows);
                resolve(rows);
            }               
        });
    });
}