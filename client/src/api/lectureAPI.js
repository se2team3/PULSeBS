import axios from 'axios';
import LectureExtended from './models/lecture_extended';

const baseURL = '/api';

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
                url = `/teachers/${user_id}/lectures`;
                break;
            default:
                throw Error('Invalid role!');
        }
    }
 
    const req_params = {from: start_date, to: end_date};
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
    if (response.status === 200) {
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
    if (response.status === 200) {
        const lecture = response.data;
        return new LectureExtended(lecture);
    } else {
        let err = { status: response.status, errObj: response.data };
        throw err;
    }
}

export  {getLecture, getLectures}