const bookingDao = require('../daos/booking_dao');
const errHandler = require('./errorHandler');

exports.createBookingTable = async function() {    
    try{
        await bookingDao.createBookingTable();
    }catch(err){
        return errHandler(err);
    }
}

exports.insertBooking = async function({lecture_id,student_id}) {
    try {
        let booking = await bookingDao.insertBooking({lecture_id,student_id});
        return booking;
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

