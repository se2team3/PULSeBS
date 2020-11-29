import {isAuthenticated, userLogout, userLogin} from './authAPI' ;
import {getBookings, bookLecture, cancelBooking} from './bookingApi' ;
import {getLecture, getLectures, cancelLecture} from './lectureAPI';

const API = { userLogin, userLogout, isAuthenticated, getLectures, getLecture, getBookings, bookLecture, cancelBooking, cancelLecture }

export default API