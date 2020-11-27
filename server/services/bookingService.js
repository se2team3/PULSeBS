const bookingDao = require('../daos/booking_dao');
const bookingExtendedDao = require('../daos/booking_extended_dao');
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

exports.retrieveBookingsbyLectureId = async function(lecture_id){
    try {
        return bookingExtendedDao.retrieveLectureBookings(lecture_id);
    } catch (error) {
        return errHandler(error);
    }
} 

exports.assertBooking = async function(student_id,lecture_id){
    try {
        return bookingDao.isBookable(student_id,lecture_id);
    } catch (error) {
        return errHandler(error);
    }
} 

exports.retrieveListOfBookedstudents = async function(lecture_id){
    try {
        return bookingDao.retrieveListOfBookedStudents(lecture_id);
    } catch (error) {
        return errHandler(error);
    }
} 
