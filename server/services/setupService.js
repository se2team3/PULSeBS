const setupDao = require('../daos/setup_dao');

//////////////////////////////////////////////
///THIS IS A STUB. TABLES WILL BE COMPLETED///
//////////////////////////////////////////////


exports.insertCourses= async function(table) {
    try {
        let book = await setupDao.insertCourses({...table});
        return book;
    } catch (error) {
        return errHandler(error);
    }
}
