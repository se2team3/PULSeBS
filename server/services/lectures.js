const lectureDao = require('../daos/lecture_dao');

const getNextDayLectures = async (offset = 1) => await lectureDao.retrieveNextDayLectures({offset});

module.exports = { getNextDayLectures };
