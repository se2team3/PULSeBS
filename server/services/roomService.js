const roomDao = require('../daos/room_dao');
const errHandler = require('./errorHandler');

exports.createRoomsTable = async function() {    
    try{
        return roomDao.createRoomsTable();
    }catch(err){
        return errHandler(err);
    }
}

exports.addRoom = async function(room) {
    try {
        let id = await roomDao.insertRoom({...room});
        return id;
    } catch (error) {
        return errHandler(error);
    }
}

exports.getRoom = async function(room_id) {
    try {
        let room = await roomDao.retrieveRoom(room_id);
        return room;
    } catch (error) {
        return errHandler(error);
    }
}

exports.deleteRooms = async function(){
    try {
        return roomDao.deleteRoomTable();
    } catch (error) {
        return errHandler(error);
    }
} 