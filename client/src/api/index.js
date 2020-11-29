import {isAuthenticated, userLogout, userLogin} from './authAPI' ;
import {getBookings, bookLecture, cancelBooking} from './bookingApi' ;
import {getLecture, getLectures} from './lectureAPI';

const API = { userLogin, userLogout, isAuthenticated, getLectures, getLecture, getBookings, bookLecture, cancelBooking }

export default API