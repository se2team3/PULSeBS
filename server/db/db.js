'use strict'

const sqlite = require('sqlite3').verbose();
const path = require('path');

let filename;
if (process.env.NODE_ENV==='test') {
        filename = 'PULSeBS.test';
}
else {
        filename = 'PULSeBS';
}
const db_name = path.join(__dirname, "database", filename);

 const db = new sqlite.Database(db_name, (err) => {
    if(err) {
        console.error(err);
        throw err;
    }
    console.log(`Connected to ${filename} database.`);
}) 

module.exports = db;
