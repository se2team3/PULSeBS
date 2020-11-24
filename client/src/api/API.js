import axios from 'axios';
import LectureExtended from './models/lecture_extended';
import Booking from './models/booking';
import BookingExtended from './models/booking_extended';

const baseURL = "/api";

async function isAuthenticated() {
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if (response.ok) {
        return userJson;
    } else {
        let err = { status: response.status, errObj: userJson };
        throw err;  // An object with the error coming from the server
    }
}

async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: username, password: password }),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({messsage: "Cannot parse server response" })}); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}
async function userLogout(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

/**
 * Get all lectures, optionally filter by time frame or use specific role and user
 * This is used to call:
 *  - GET /lectures
 *  - GET /lectures?from=<start_date>&to=<end_date>
 *  - GET /students/{student_id}/lectures
 *  - GET /students/{student_id}/lectures?from=<start_date>&to=<end_date>
 *  - GET /teachers/{student_id}/lectures
 *  - GET /teachers/{student_id}/lectures?from=<start_date>&to=<end_date>
 *  TODO: do we really need all these endpoints? The server should know already about the user and should be able to answer accordingly(?)
 *
 * @param {*} [start_date=undefined] datetime then transformed in unix timestamp
 * @param {*} [end_date=undefined] datetime then transformed in unix timestamp
 * @param {*} [role=undefined] "student" or "teacher"
 * @param {*} [user_id=undefined] valid user id
 * @returns [] of Lecture objects or empty []
 */
async function getLectures(start_date = undefined, end_date = undefined, role = undefined, user_id = undefined) {
    let url = "/lectures";
    if (role !== undefined && user_id !== undefined) {
        switch (role) {
            case "student":
                url = `/students/${user_id}/lectures`;
                break;
            case "teacher":
                url = `/teachers/${user_id}/lectures`
                break;
        }
    } 

 
    const req_params = {from: start_date, to: end_date};
     /*if (start_date !== undefined || end_date !== undefined) {
        if (start_date !== undefined)
            req_params['from'] = moment(start_date).unix();
        if (end_date !== undefined)
            req_params['to'] = moment(end_date).unix();
    } */
    const response = await axios.get(baseURL + url, { params: req_params }).catch(error => {
        if (error.response) {
            let err = { status: error.response.status, errObj: error.response.data };
            throw err;  // An object with the error coming from the server
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    });
    if (response.status == 200) {
        return response.data.map(
            (o) => new LectureExtended(o));
    } else {
        let err = { status: response.status, errObj: response.data };
        throw err;  // An object with the error coming from the server
    }
}

/**
 * Get a lecture given its id
 *
 * @param {*} id valid lecture id
 * @returns Lecture object
 */
async function getLecture(id) {
    const url = "/lectures/" + id
    const response = await axios.get(baseURL + url).catch(error => {
        if (error.response) {
            let err = { status: error.response.status, errObj: error.response.data };
            throw err;  
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
    });
    if (response.status == 200) {
        const lecture = response.data;
        return new LectureExtended(lecture);
    } else {
        let err = { status: response.status, errObj: response.data };
        throw err;
    }
}

/**
 * Get list of bookings for a lecture
 *
 * @param {*} lecture_id valid lecture id
 * @returns [] of Bookings or empty []
 */
async function getBookings(lecture_id){
    let url = `/lectures/${lecture_id}/bookings`;

    const response = await axios.get(baseURL + url).catch(error => {
        if (error.response) {
            let err = { status: error.response.status, errObj: error.response.data };
            throw err;  // An object with the error coming from the server
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    });
    if (response.status == 200) {
        return response.data.map(
            (o) => new BookingExtended(o.lecture_id, o.student_id, o.waiting, o.present, o.updated_at, o.deleted_at, o.student_university_id, o.student_name, o.student_surname));
    } else {
        let err = { status: response.status, errObj: response.data };
        throw err;  // An object with the error coming from the server
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
        if (error.response) {
            let err = { status: error.response.status, errObj: error.response.data };
            throw err;  // An object with the error coming from the server
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
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

    const response = await axios.delete(baseURL + url).catch(error => {
        if (error.response) {
            let err = { status: error.response.status, errObj: error.response.data };
            throw err;  // An object with the error coming from the server
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    });
    if (response.status === 200) {
        return true;
    } else {
        let err = { status: response.status, errObj: response.data };
        throw err;  // An object with the error coming from the server
    }
}

const API = { isAuthenticated, userLogin, userLogout, getLectures, getLecture, getBookings, bookLecture, cancelBooking }

export default API