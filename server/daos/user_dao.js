// import database
// import modules

const e = require('express');
const db = require('../db/db.js');
const User = require('../models/user.js');
const { unsubscribe } = require('../routes/student.js');

const createUser = function (row){
    return new Room(row.id,row.university_id,row.email,row.password,row.name,row.surname,row.role);
}

// it creates the user table
exports.createUsersTable = function() {
    return new Promise ((resolve,reject) => {
        const sql = `CREATE TABLE Users (id INTEGER NOT NULL PRIMARY KEY, university_id TEXT NOT NULL UNIQUE, email TEXT NOT NULL UNIQUE,
                     password TEXT NOT NULL, name TEXT NOT NULL, surname TEXT NOT NULL, role TEXT NOT NULL CHECK (role IN("student","teacher","officer","manager")))`
        db.run(sql,[],(err) =>{
            if(err)
                reject(err);
            else
                resolve(null);
        });
    })
}
//it allows you to insert a new user
exports.insertUser = function({university_id,email,password,name,surname,role}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Users(university_id,email,password,name,surname,role) VALUES(?,?,?,?,?,?)'
        db.run(sql,[university_id,email,password,name,surname,role], function(err) {
            if(err){
                console.log("ERROR" + err);
                reject(err);
            }
            else{
                resolve(this.lastID);   
            }
        });
    })
}
//gets the user with the selected id
exports.retrieveUser = function({id}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT * FROM Users WHERE id = ?'
        db.get(sql, [id], (err, row) => {
            if(err)
                return reject(err);
            if (!row)
                resolve(null);
            else{
                const user = createUser(row);
                resolve(user);
            }
                
        });
    })
}

exports.deleteUserTable = function() {
    return new Promise ((resolve,reject) =>{
        const sql = 'DROP TABLE Users '
        db.run(sql, (err, row) => {
            if(err)
                return reject(err);
            else resolve(null);
        });
    })
}