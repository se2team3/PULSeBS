import {isAuthenticated, userLogout, userLogin} from './authAPI' ;
import {getBookings, bookLecture, cancelBooking, getTeacherBookings} from './bookingApi' ;
import {getLecture, getLectures, cancelLecture, patchLecture} from './lectureAPI';

const API = { userLogin, userLogout, isAuthenticated, getLectures, getLecture, getBookings, bookLecture, cancelBooking, cancelLecture, patchLecture, getTeacherBookings }

export default API