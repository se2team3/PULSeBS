const e = require('express');
const db = require('../db/db.js');
const bcrypt = require('bcrypt');
const { saltRounds } = require('../config/bcrypt.json');
const User = require('../models/user.js');

exports.createInternalCoursesTable = function () {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS Internal_Courses (code TEXT NOT NULL UNIQUE, year INTEGER NOT NULL CHECK (year IN (1,5)),
                     semester INTEGER NOT NULL CHECK (semester IN (1,2)),
                     course TEXT NOT NULL,
                     teacher TEXT NOT NULL,
                     PRIMARY KEY(code))`
        db.run(sql, [], (err) => {
            if (err)
                reject(err);
            else
                resolve(null);
        });
    })
}

exports.createInternalEnrollmentTable = function () {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS Internal_Enrollment (code TEXT NOT NULL, student INTEGER NOT NULL)`
        db.run(sql, [], (err) => {
            if (err)
                reject(err);
            else
                resolve(null);
        });
    })
}

exports.createInternalScheduleTable = function () {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS Internal_Schedule (code TEXT NOT NULL, room TEXT NOT NULL,
                     day TEXT NOT NULL,
                     seats TEXT NOT NULL,
                     time TEXT NOT NULL)`
        db.run(sql, [], (err) => {
            if (err)
                reject(err);
            else
                resolve(null);
        });
    })
}

exports.createInternalStudentsTable = function () {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS Internal_Students (id INTEGER NOT NULL UNIQUE,
                     name TEXT NOT NULL,
                     surname TEXT NOT NULL,
                     city TEXT NOT NULL,
                     official_email TEXT NOT NULL UNIQUE,
                     birthday TEXT NOT NULL,
                     ssn TEXT NOT NULL UNIQUE,
                     PRIMARY KEY(id))`
        db.run(sql, [], (err) => {
            if (err)
                reject(err);
            else
                resolve(null);
        });
    })
}

exports.createInternalTeachersTable = function () {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS Internal_Teachers (number INTEGER NOT NULL UNIQUE,
                     given_name TEXT NOT NULL,
                     surname TEXT NOT NULL,
                     official_email TEXT NOT NULL UNIQUE,
                     ssn TEXT NOT NULL UNIQUE,
                     PRIMARY KEY(number))`
        db.run(sql, [], (err) => {
            if (err)
                reject(err);
            else
                resolve(null);
        });
    })
}


exports.setupInsertTeacher = async function({university_id, name, surname, email, SSN}) {
    console.log('inside user_dao/setupInsertUser')

    //console.log(university_id)
    let password = 'passw0rd';
    let role = 'teacher';
    //console.log(password);
    
    //console.log(role);
    const hash = await bcrypt.hash(password, saltRounds);
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Users(university_id,email,password,name,surname,role,ssn) VALUES(?,?,?,?,?,?,?)'
        db.run(sql,[university_id,email,hash,name,surname,role,SSN],function(err) {
            if(err)
                reject(err);
            else
                resolve(this.lastID);
        });
    })
}
exports.setupInsertStudent = async function({university_id, name, surname, city, email, birthday, SSN}) {
    console.log('inside user_dao/setupInsertStudent')

    //console.log('user ID' + university_id)
    let password = 'passw0rd';
    let role = 'student';
    //console.log(password);
    
    console.log(role);
    const hash = await bcrypt.hash(password, saltRounds);
    return new Promise ((resolve,reject) =>{
        //console.log('before sql query');

        const sql = 'INSERT INTO Users(university_id,email,password,name,surname,role,ssn,city,birthday) VALUES(?,?,?,?,?,?,?,?,?)'
        db.run(sql,[university_id,email,hash,name,surname,role, SSN, city,birthday],function(err) {
            if(err)
                reject(err);
            else
                resolve(this.lastID);
        });
    })
}

exports.setupInsertInternalCourse = async function({code, year, semester, course, teacher}) {
    console.log('inside user_dao/setupInsertInternalCourse')
   // console.log(code)
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Internal_Courses(code,year, semester,course, teacher) VALUES(?,?,?,?,?)'
        db.run(sql,[code, year, semester, course, teacher],function(err) {
            if(err)
                reject(err);
            else
                resolve(this.lastID);
        });
    })
}

exports.setupInsertInternalEnrollment = async function({code, student}) {
    console.log('inside user_dao/setupInsertInternalEnrollment')
    //console.log(code)
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Internal_Enrollment(code,student) VALUES(?,?)'
        db.run(sql,[code, student],function(err) {
            if(err)
                reject(err);
            else
                resolve(this.lastID);
        });
    })
}

exports.setupInsertInternalEnrollment = async function({code, student}) {
    console.log('inside user_dao/setupInsertInternalEnrollment')
    //console.log(code)
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Internal_Enrollment(code,student) VALUES(?,?)'
        db.run(sql,[code, student],function(err) {
            if(err)
                reject(err);
            else
                resolve(this.lastID);
        });
    })
}
exports.setupInsertInternalSchedule = async function({code, room, day, seats, time }) {
    console.log('inside user_dao/setupInsertInternalSchedule')
    //console.log(code)
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Internal_Schedule(code, room, day, seats, time) VALUES(?,?,?,?,?)'
        db.run(sql,[code, room, day, seats, time],function(err) {
            if(err)
                reject(err);
            else
                resolve(this.lastID);
        });
    })
}