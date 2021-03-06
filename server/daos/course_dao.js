// import database
// import modules

const db = require('../db/db.js')

// it creates the course table
exports.createCourseTable = function() {
    return new Promise ((resolve,reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS Courses (id INTEGER NOT NULL PRIMARY KEY, code TEXT NOT NULL UNIQUE,
                     name TEXT NOT NULL, teacher_id INTEGER NOT NULL, year INTEGER, semester INTEGER, FOREIGN KEY(teacher_id) REFERENCES Users(id))`
        db.run(sql,[],(err) =>{
            if(err)
                reject(err)
            else
                resolve(null)
        })
    })
}

//clears the lecture table
exports.clearCourseTable = function () {
    return new Promise ((resolve,reject) =>{
        const sql = 'DELETE FROM Courses'
        db.run(sql,[],(err) =>{
            if(err)
                reject(err)
            else
                resolve()
        })
    })
}

//it allows you to insert a new course
exports.insertCourse = function({code,name,teacher_id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Courses(code,name,teacher_id) VALUES(?,?,?)'
        db.run(sql,[code,name,teacher_id],function(err){
            if(err)
                reject(err)
            else
                resolve(this.lastID) 
        })
    })
}

//it allows you to retrieve a course by its name
exports.retrieveCourseByName = function(name) {
    return new Promise ((resolve,reject) =>{
        const sql = `
            SELECT id, code, name, teacher_id, year, semester
            FROM Courses
            WHERE name = ? 
        `
        db.get(sql,[name],function(err, row){
            if(err)
                reject(err)
            else
                resolve(row)
        })
    })
}

exports.bulkInsertionCourses = function(array){
    return new Promise ((resolve,reject) =>{
        let sql=''
        for (let i = 0; i < array.length; i++) {
                
            sql += `INSERT INTO Courses(code,name,teacher_id,year,semester) 
            VALUES('${array[i].code}',"${array[i].name}",${array[i].teacher_id},${array[i].year},${array[i].semester}); `
        }
        db.exec("BEGIN TRANSACTION; "+ sql + " COMMIT;",(err) => {
            if(err)
                reject(err)
        })    
        db.all("SELECT code, id FROM Courses",[],(err,rows)=>{
            if(err)
                reject(err)
            else
                resolve(rows)
        })
    });
}

exports.isEmpty = function(){
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT COUNT(*) as n FROM Courses'
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