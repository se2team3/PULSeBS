// import database
// import modules

const db = require('../db/db.js');

// it creates the lecture table
exports.createLectureTable = function() {
    return new Promise ((resolve,reject) => {
        const sql = `CREATE TABLE Lectures (
            id INTEGER NOT NULL PRIMARY KEY, 
            datetime TEXT, 
            course_id TEXT NOT NULL,
            room_id TEXT NOT NULL, 
            virtual BOOLEAN NOT NULL DEFAULT (0) CHECK (virtual IN (0,1)),
            deleted_at TEXT, 
            FOREIGN KEY(course_id) REFERENCES Courses(id), 
            FOREIGN KEY(room_id) REFERENCES Rooms(id)
            )`;

        db.run(sql,[],(err) =>{
            if(err)
                reject(err);
            else
                resolve(null);
        });
    })
}
//it allows you to insert a new lecture
exports.insertLecture = function({datetime,course_id,room_id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Lectures(datetime,course_id,room_id) VALUES(?,?,?)'
        db.run(sql,[datetime,course_id,room_id],(err) =>{
            if(err)
                reject(err);
            else
                resolve(this.lastID);   
        });
    })
}
//gets the lecture with the selected id
exports.retrieveLecture = function({id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT * FROM Lectures WHERE id = ?'
        db.get(sql, [id], (err, row) => {
            if(err)
                return reject(err);
            if (!row)
                resolve(null);
            else{
                const lecture = createLecture(row);
                resolve(lecture);
            }               
        });
    })
}
