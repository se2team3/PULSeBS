const lectureDao = require('../daos/lecture_dao');

/**
 * Retrieves the lessons scheduled for a specific day
 * @param {int} offset - number of days since today
 * @returns {Promise<{teacher: {name,surname,email},course:{name,code},date,room,bookings}[]>}
 */
const getNextDayLectures = async (offset = 1) => await lectureDao.retrieveNextDayLectures({offset});

module.exports = { getNextDayLectures };
