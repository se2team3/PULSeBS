import {isAuthenticated, userLogout, userLogin} from './authAPI' ;
import {getBookings, bookLecture} from './bookingAPI' ;
import {getLecture, getLectures} from './lectureAPI';

const API = { userLogin, userLogout, isAuthenticated, getLectures, getLecture, getBookings, bookLecture }

export default API