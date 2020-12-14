const setupDao = require('../daos/setup_dao');
const bookingDao = require('../daos/booking_dao');
const bookingExtendedDao = require('../daos/booking_extended_dao');
const userDao  = require('../daos/user_dao');
const lectureDao = require('../daos/lecture_dao');

const errHandler = require('./errorHandler');

//////////////////////////////////////////////
///THIS IS A STUB. TABLES WILL BE COMPLETED///
//////////////////////////////////////////////


const insertUser = async function(user) {

    let {univesity_id,email,password,name,surname,role} = user;
    try {
        let id = await userDao.insertUser({...user});
        return id;
    } catch (error) {
        console.log(error)
        return errHandler(error);
    }
}


