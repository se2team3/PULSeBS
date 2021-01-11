const db = require('../db/db.js')

// it creates the course_student table
exports.createCourse_StudentTable = function() {
    return new Promise ((resolve,reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS Course_Student (course_id INTEGER NOT NULL, student_id INTEGER NOT NULL,
                     PRIMARY KEY(course_id,student_id),
                     FOREIGN KEY(course_id) REFERENCES Courses(id), FOREIGN KEY(student_id) REFERENCES Users(id))`
        db.run(sql,[],(err) =>{
            if(err)
                reject(err)
            else
                resolve(null)
        })
    })
}

//clears the lecture table
exports.clearCourse_StudentTable = function () {
    return new Promise ((resolve,reject) =>{
        const sql = 'DELETE FROM Course_Student'
        db.run(sql,[],(err) =>{
            if(err)
                reject(err)
            else
                resolve()
        })
    })
}

//it allows you to insert a new booking
exports.assingCourseToStudent = function({course_id,student_id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Course_Student(course_id,student_id) VALUES(?,?)'
        db.run(sql,[course_id,student_id],function(err){
            if(err)
                reject(err)
            else
                resolve(null)  
        })
    })
}

//gets the courses given the student_id
exports.retrieveStudentCourses = function({student_id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT course_id FROM Course_Student WHERE student_id = ?'
        db.all(sql, [student_id], (err, rows) => {
            if(err)
                return reject(err)
            if (!rows)
                resolve(null)
            else{
                resolve(rows)
            }               
        })
    })
}

exports.retrieveAllStudentsCourses = function(){
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT course_id, student_id FROM Course_Student'
        db.all(sql, [], (err, rows) => {
            if(err)
                return reject(err)
            if (!rows)
                resolve(null)
            else{
                resolve(rows)
            }
        })
    })
}

exports.bulkInsertionEnrollments = function(array){
    return new Promise ((resolve,reject) =>{
        let sql=''
    for (let i = 0; i < array.length; i++) {
        //INSERT INTO Course_Student(course_id,student_id) VALUES(?,?)
             
        sql += `INSERT INTO Course_Student(course_id,student_id) 
        VALUES(${array[i].course_id},${array[i].student_id}); `
    }
    db.exec("BEGIN TRANSACTION; "+ sql + " COMMIT;",(err) => {
        if(err)
            reject(err)
        else
            resolve()
    })    
    })
}

exports.isEmpty = function(){
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT COUNT(*) as n FROM Course_Student'
        db.get(sql, [], (err, row) => {
            if(err)
                return reject(err)
            if (!row)
                resolve(null)
            else{
                resolve(row.n === 0)
            }
        })
    })
}