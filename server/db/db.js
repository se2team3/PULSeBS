'use strict'

var sqlite = require('sqlite3').verbose();
var path = require('path');

const filename = 'PULSeBS';
const db_name = path.join(__dirname, "database", filename);

 const db = new sqlite.Database(db_name, (err) => {
    if(err) {
        console.error(err);
        throw err;
    };
    console.log(`Connected to ${filename} database.`);
}) 

module.exports = db;
