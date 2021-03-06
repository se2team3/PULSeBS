// import database
// import modules

const db = require('../db/db.js');
/*const Room = require('../models/room.js');

const createRoom = function (row){
    return new Room(row.id,row.name,row.seats);
}
*/
// it creates the room table
exports.createRoomsTable = function() {
    return new Promise ((resolve,reject) => {
        const sql = 'CREATE TABLE IF NOT EXISTS Rooms (id INTEGER NOT NULL PRIMARY KEY, name TEXT NOT NULL, seats INTEGER NOT NULL)'
        db.run(sql,[],(err) =>{
            if(err)
                reject(err);
            else
                resolve(null);
        });
    })
}

//clears the room table
exports.clearRoomTable = function () {
    return new Promise ((resolve,reject) =>{
        const sql = 'DELETE FROM Rooms';
        db.run(sql,[],(err) =>{
            if(err)
                reject(err);
            else
                resolve();
        });
    })
}

//it allows you to insert a new room
exports.insertRoom = function({name,seats}) {
    return new Promise ((resolve,reject) =>{
        const sql = 'INSERT INTO Rooms(name,seats) VALUES(?,?)'
        db.run(sql,[name,seats],function(err){
            if(err)
                reject(err);
            else
                resolve(this.lastID);   
        });
    })
}

//retrieves room by its name
exports.getRoomByName = function(name) {
    return new Promise ((resolve,reject) =>{
        const sql = `
            SELECT id, name, seats
            FROM Rooms
            WHERE name = ?
        `;
        db.get(sql,[name],function(err, row){
            if(err)
                reject(err);
            else
                resolve(row);
        });
    })
}

/*
//gets the room with the selected id
exports.retrieveRoom = function(id) {
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT * FROM Rooms WHERE id = ?'
        db.get(sql, [id], (err, row) => {
            if(err)
                return reject(err);
            if (!row)
                resolve(null);
            else{
                const room = createRoom(row);
                resolve(room);
            }
                
        });
    })
}
exports.deleteRoomTable = function() {
    return new Promise ((resolve,reject) =>{
        const sql = 'DROP TABLE Rooms '
        db.run(sql, (err, row) => {
            if(err)
                return reject(err);
            else resolve(null);
        });
    })
}*/

exports.isEmpty = function(){
    return new Promise ((resolve,reject) =>{
        const sql = 'SELECT COUNT(*) as n FROM Rooms'
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