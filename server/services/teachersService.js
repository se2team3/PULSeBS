const teacherDao = require('../daos/teachers_dao');
const errHandler = require('./errorHandler');

exports.getLecturesByTeacherAndTime = async function(teacher_id,start_date, end_date) {    
    try{
        return teacherDao.getLecturesByTeacherAndTime(teacher_id,start_date,end_date);
    }catch(err){
        return errHandler(err);
    }  
}
