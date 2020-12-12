const e = require('express');
const db = require('../db/db.js');


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
        const sql = `CREATE TABLE IF NOT EXISTS Internal_Schedule (code TEXT NOT NULL, room INTEGER NOT NULL CHECK (room IN (1,10)),
                     day TEXT NOT NULL,
                     seats INTEGER NOT NULL CHECK (seats IN (10,150)),
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

