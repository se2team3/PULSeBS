const teacherDao = require('../daos/teachers_dao');
const errHandler = require('./errorHandler');

exports.getLecturesByTeacherAndTime = async function(teacher_id,start_date, end_date) {    
    try{
        let lectures  = await teacherDao.getLecturesByTeacherAndTime(teacher_id,start_date,end_date);
        return lectures;
    }catch(err){
        return errHandler(err);
    }  
}
