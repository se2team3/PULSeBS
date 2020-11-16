const bookingDao = require('../daos/booking_dao');
const errHandler = require('./errorHandler');

exports.createBookingTable = async function() {    
    try{
        await bookingDao.createBookingTable();
    }catch(err){
        return errHandler(err);
    }
}

exports.insertBooking = async function(booking) {
    try {
        let book = await bookingDao.insertBooking({...booking});
        return book;
    } catch (error) {
        return errHandler(error);
    }
}

exports.deleteBookings = async function(){
    try {
        return bookingDao.deleteBookingTable();
    } catch (error) {
        return errHandler(error);
    }
} 

