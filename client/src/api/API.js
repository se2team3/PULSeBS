import axios from 'axios';
import moment from 'moment';

import Lecture from './models/lecture';

const baseURL = "";

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

    const req_params = {};
    if (start_date !== undefined || end_date !== undefined) {
        if (start_date !== undefined)
            req_params['from'] = moment(start_date).unix();
        if (end_date !== undefined)
            req_params['to'] = moment(end_date).unix();
    }

    console.log(url)
    const response = await axios.get(baseURL + url);
    if (response.status==200) {
        return response.data.map(
            (o) => new Lecture(o.id, o.datetime, o.course_id, o.room_id, o.virtual, o.deleted_at));
    } else {
        let err = { status: response.status, errObj: response.data };
        throw err;  // An object with the error coming from the server
    }
}

const API = { getLectures }

export default API