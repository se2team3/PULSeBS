const bookingDao = require('../daos/booking_dao');
const lectureDao = require('../daos/lecture_dao');
const bookingExtendedDao = require('../daos/booking_extended_dao');
const errHandler = require('./errorHandler');
const mailUtils = require("../utils/mail");
/*
exports.createBookingTable = async function() {    
    try{
        await bookingDao.createBookingTable();
    }catch(err){
        return errHandler(err);
    }
}*/

const insertBooking = async function(booking) {
    try {
        let book = await bookingDao.insertBooking({...booking});
        if (!book.waiting)
            mailUtils.notifyBooking(book);
        else
            mailUtils.notifyWaiting(book);
        return book;
    } catch (error) {
        return errHandler(error);
    }
}

exports.insertBooking = insertBooking;

/*
exports.deleteBookings = async function(){
    try {
        return bookingDao.deleteBookingTable();
    } catch (error) {
        return errHandler(error);
    }
} */

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

exports.deleteBooking = async function(booking) {
    try {
        let number = await bookingDao.deleteBooking({...booking});
        return number;
    } catch (error) {
        return errHandler(error);
    }
}

exports.popWaitingStudent = async function (lecture_id) {
    try {
        const waitingStudents = await lectureDao.getWaitingStudents(lecture_id);
        if (waitingStudents.length) {
            const booking = await bookingDao.removeFromWaitingList({ lecture_id, student_id: waitingStudents[0] });
            mailUtils.notifyPopping(booking);
        }
    } catch (error) {
        return errHandler(error);
    }
}