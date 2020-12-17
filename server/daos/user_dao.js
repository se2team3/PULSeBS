// import database
// import modules

const bcrypt = require('bcrypt');
const { saltRounds } = require('../config/bcrypt.json');
const db = require('../db/db.js');
const User = require('../models/user.js');

const createUser = function (row){
    return new User(row.id,row.university_id,row.email,row.password,row.name,row.surname,row.role);
}

// it creates the user table
exports.createUsersTable = function() {
    return new Promise ((resolve,reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS Users (id INTEGER NOT NULL PRIMARY KEY, university_id TEXT NOT NULL UNIQUE, email TEXT NOT NULL UNIQUE,
                     password TEXT NOT NULL, name TEXT NOT NULL, surname TEXT NOT NULL, role TEXT NOT NULL CHECK (role IN("student","teacher","officer","manager")),
                     ssn TEXT, city TEXT, birthday TEXT)`
        db.run(sql,[],(err) =>{
            if(err)
                reject(err);
            else
                resolve(null);
        });
    })
}

//clears the lecture table
exports.clearUserTable = function () {
    return new Promise ((resolve,reject) =>{
        const sql = `DELETE FROM Users WHERE role!= 'officer' AND role!='manager'`;
        db.run(sql,[],(err) =>{
            if(err)
                reject(err);
            else
                resolve();
        });
    })
}

//it allows you to insert a new user
exports.insertUser = async function({university_id,email,password,name,surname,role}) {
    const hash = await bcrypt.hash(password, saltRounds);
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Users(university_id,email,password,name,surname,role) VALUES(?,?,?,?,?,?)'
        db.run(sql,[university_id,email,hash,name,surname,role],function(err) {
            if(err)
                reject(err);
            else
                resolve(this.lastID);
        });
    })
}

//gets the user with the selected id
exports.retrieveUser = function(id) {
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


//gets the user with the selected id
exports.retrieveUserByEmail = function(email) {
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT * FROM Users WHERE email = ?'
        db.get(sql, [email], (err, row) => {
            if(err)
                return reject(err);
            if (!row) {
                resolve(null);
            }
            else{
                const user = createUser(row);
                resolve(user);
            }
        });
    })
}
/*
exports.deleteUsersTable = function() {
    return new Promise ((resolve,reject) =>{
        const sql = 'DROP TABLE Users '
        db.run(sql, (err, row) => {
            if(err)
                return reject(err);
            else resolve(null);
        });
    })
}

*/
exports.bulkInsertionUsers = function(array){
    return new Promise ((resolve,reject) =>{
        let sql='';

    for (let i = 0; i < array.length; i++) {
        sql += `INSERT INTO Users(university_id,email,password,name,surname,role,ssn,city,birthday) VALUES('${array[i].university_id}','${array[i].email}',
        '${array[i].password}','${array[i].name}','${array[i].surname}','${array[i].role}','${array[i].ssn}',"${array[i].city}",'${array[i].birthday}'); `
    }
   
    db.exec("BEGIN TRANSACTION; "+ sql + " COMMIT;",(err) => {
        if(err)
            reject(err);
        
    })    
    
    db.all("SELECT university_id, id FROM Users WHERE (role LIKE 'student' OR role LIKE 'teacher')",[],(err,rows)=>{
        if(err)
            reject(err)
        else
            resolve(rows)
    })
    
     
    });
}

exports.isEmpty = function(){
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT COUNT(*) as n FROM Users WHERE (role LIKE \'student\' OR role LIKE \'teacher\')'
        db.get(sql, [], (err, row) => {
            if(err)
                return reject(err);
            if (!row)
                resolve(null);
            else{
                resolve(row.n === 0);
            }
        });
    });
}