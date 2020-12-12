import Booking from './models/booking';
import BookingExtended from './models/booking_extended';
import LectureExtended from './models/lecture_extended';
import axios from 'axios';
import {whatWentWrong, deleteResource} from './utils';

const baseURL = '/api';

/**
 * Get list of bookings for a lecture
 *
 * @param {*} lecture_id valid lecture id
 * @returns [] of Bookings or empty []
 */
async function getBookings(lecture_id){
    let url = `/lectures/${lecture_id}/bookings`;

    const response = await axios.get(baseURL + url).catch(error => {
        whatWentWrong(error);
    });
    if (response.status === 200) {
        return response.data.map(
            (o) => new BookingExtended(o.lecture_id, o.student_id, o.waiting, o.present, o.updated_at, o.deleted_at, o.student_university_id, o.student_name, o.student_surname));
    } else {
        let err = { status: response.status, errObj: response.data };
        throw err;  // An object with the error coming from the server
    }
}

/**
 * Get list of bookings for all the teacher's lectures
 *
 * @param {number} teacher_id - valid teacher id
 * @param {string} [from] - optional starting date
 * @param {string} [to] - optional ending date
 * @returns [] of ExtendedLectures
 */
async function getTeacherBookings(teacher_id, from, to){
    let url = `/bookings`;

    const params = { from, to };

    const response = await axios.get(baseURL + url, { params }).catch(error => {
        whatWentWrong(error);
    });
    if (response.status === 200) {
        return response.data.map(res => new LectureExtended(res));
    } else {
        throw { status: response.status, errObj: response.data };
    }
}

/**
 * Book a seat to a lecture given a student id and lecture id
 *
 * @param {*} student_id a valid student id
 * @param {*} lecture_id a valid lecture id
 * @returns the newly created Booking object
 */
async function bookLecture(student_id, lecture_id){
    let url = `/students/${student_id}/bookings`;

    const response = await axios.post(baseURL + url, {
        lecture_id: lecture_id
    }).catch(error => {
        whatWentWrong(error);
    });
    if (response.status === 201) {
        const booking = response.data;
        return new Booking(booking.lecture_id, booking.student_id, booking.waiting, booking.present, booking.updated_at, booking.deleted_at);
    } else {
        let err = { status: response.status, errObj: response.data };
        throw err;  // An object with the error coming from the server
    }
}

/**
 * Cancel a booking given student and lecture
 *
 * @param {*} student_id a valid student id
 * @param {*} lecture_id a valid lecture id
 * @returns true if cancelled successfully, throws error otherwise
 */
async function cancelBooking(student_id, lecture_id){
    let url = `/students/${student_id}/lectures/${lecture_id}`;
    return deleteResource(baseURL+url);
}


export {bookLecture, getBookings, cancelBooking, getTeacherBookings}