const roomDao = require('../daos/room_dao');
const errHandler = require('./errorHandler');

exports.createRoomsTable = async function() {    
    try{
        await roomDao.createRoomsTable();
    }catch(err){
        return errHandler(err);
    }
}

exports.addRoom = async function(name,teacher_id) {
    try {
        let id = await roomDao.insertRoom(name,teacher_id);
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