import axios from 'axios';
import {whatWentWrong} from './utils';

const baseURL = '/api';

/**
 * API call for setup endpoint, expected to cause the drop of all tables in the db and insert of all the provided data
 *
 * @param {*} students array of dictionaries with fields Id, Name, Surname, City, OfficialEmail, Birthday, SSN.
 * @param {*} teachers array of dictionaries with fields Number, GivenName, Surname, OfficialEmail, SSN.
 * @param {*} courses array of dictionaries with fields Code, Year, Semester, Course, Teacher.
 * @param {*} enrollment array of dictionaries with fields Code, Student.
 * @param {*} schedule array of dictionaries with fields Code, Room, Day, Seats, Time.
 * @returns true, or throws error if something went wrong
 */
async function setup(students, teachers, courses, enrollment, schedule){
    let url = `/setup`;

    const response = await axios.post(baseURL + url, {
        students: students,
        teachers: teachers,
        courses: courses,
        enrollment: enrollment,
        schedule:  schedule
    }).catch(error => {
        whatWentWrong(error);
    });
    if (response.status === 201) {
        return true;
    } else {
        let err = { status: response.status, errObj: response.data };
        throw err;  // An object with the error coming from the server
    }
}

const setupAPI = {setup};

export default setupAPI;