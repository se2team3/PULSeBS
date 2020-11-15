// import database
// import modules

const db = require('../db/db.js');

// it creates the course_student table
exports.createCourse_StudentTable = function() {
    return new Promise ((resolve,reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS Course_Student (course_id TEXT NOT NULL, student_id TEXT NOT NULL,
                     PRIMARY KEY(course_id,student_id),
                     FOREIGN KEY(course_id) REFERENCES Courses(id), FOREIGN KEY(student_id) REFERENCES Users(id))`
        db.run(sql,[],(err) =>{
            if(err)
                reject(err);
            else
                resolve(null);
        });
    })
}
//it allows you to insert a new booking
exports.assingCourseToStudent = function({course_id,student_id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Course_Student(course_id,student_id) VALUES(?,?)'
        db.run(sql,[course_id,student_id],function(err){
            if(err)
                reject(err);
            else
                resolve(null);   
        });
    })
}

//gets the courses given the student_id
exports.retrieveStudentCourses = function({student_id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT course_id FROM Course_Student WHERE student_id = ?'
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
//gets the students given the course_id
exports.retrieveEnrolledStudents = function({course_id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT student_id FROM Course_Student WHERE course_id = ?'
        db.all(sql, [lecture_id], (err, rows) => {
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
exports.deleteCourse_StudentTable = function() {
    return new Promise ((resolve,reject) =>{
        const sql = 'DROP TABLE Course_Student '
        db.run(sql, (err, row) => {
            if(err)
                return reject(err);
            else resolve(null);
        });
    })
}