'use strict'

var sqlite = require('sqlite3').verbose();

const dbPath = './db/pulsebs.db';

/* const db = new sqlite.Database(dbPath, (err) => {
    if(err) {
        console.error(err);
        throw err;
    };
}) */

module.exports = db;