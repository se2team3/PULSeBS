'use strict'

var sqlite = require('sqlite3').verbose();

const dbPath = './database/PULSeBS.db';
const db_name = 'PULSeBS';

 const db = new sqlite.Database(dbPath, (err) => {
    if(err) {
        console.error(err);
        throw err;
    };
    console.log(`Connected to ${db_name} database.`);
}) 

module.exports = db;