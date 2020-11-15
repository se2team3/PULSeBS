// import database
// import modules

const db = require('../db/db.js');
const Course = require('../models/course.js');

const createCourse = function (row){
    return new Course(row.id,row.code,row.name,row.teacher_id);
}

// it creates the course table
exports.createCourseTable = function() {
    return new Promise ((resolve,reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS Courses (id INTEGER NOT NULL PRIMARY KEY, code TEXT NOT NULL UNIQUE,
                     name TEXT NOT NULL, teacher_id TEXT NOT NULL, FOREIGN KEY(teacher_id) REFERENCES Users(id))`
        db.run(sql,[],(err) =>{
            if(err)
                reject(err);
            else
                resolve(null);
        });
    })
}
//it allows you to insert a new course
exports.insertCourse = function(course) {
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Courses(code,name,teacher_id) VALUES(?,?,?)'
        db.run(sql,[course.code,course.name,course.teacher_id],function(err){
            if(err)
                reject(err);
            else
                resolve(this.lastID);   
        });
    })
}
//gets the course with the selected id
exports.retrieveCourse = function(id) {
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT * FROM Courses WHERE id = ?'
        db.get(sql, [id], (err, row) => {
            if(err)
                return reject(err);
            if (!row)
                resolve(null);
            else{
                const course = createCourse(row);
                resolve(course);
            }
                
        });
    })
}
exports.deleteCourseTable = function() {
    return new Promise ((resolve,reject) =>{
        const sql = 'DROP TABLE Courses'
        db.run(sql, (err, row) => {
            if(err)
                return reject(err);
            else resolve(null);
        });
    })
}