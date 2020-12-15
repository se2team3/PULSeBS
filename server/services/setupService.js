const setupDao = require('../daos/setup_dao');
const bookingDao = require('../daos/booking_dao');
const bookingExtendedDao = require('../daos/booking_extended_dao');
const userDao  = require('../daos/user_dao');
const lectureDao = require('../daos/lecture_dao');
const errHandler = require('./errorHandler');
const sleep = require('../utils/sleep');
const bcrypt = require("bcrypt");


//////////////////////////////////////////////
///THIS IS A STUB. TABLES WILL BE COMPLETED///
//////////////////////////////////////////////


const setupInsertTeacher = async function(teacher) {
   console.log('inside setupService/setupInsertteacher');
   let teacher_dict = teacher;
    
    var teacher_array = [];
    for (const [key, value] of Object.entries(teacher_dict)) {
        teacher_array.push(value);
      }
      var teacher_array2 = [];
      teacher_array2= teacher_array[0];
      var teacher_array_rows = [];
      var size = Object.keys(teacher_array2).length;

      var i;
      for (i = 0; i < size; i++) {
        teacher_array_rows = teacher_array2[i];
        var teacher_array_rows3 = Object.values(teacher_array_rows);
        const teacher_object = {
            university_id: teacher_array_rows3[0],
            name: teacher_array_rows3[1],
            surname: teacher_array_rows3[2],
            email: teacher_array_rows3[3],
            SSN: teacher_array_rows3[4]
          };
          try {
            let id = await setupDao.setupInsertTeacher({...teacher_object});
            //return id;
        } catch (error) {
            console.log(error)
            return errHandler(error);
        }


}
      //console.log(user_object);

}

const setupInsertStudent = async function(student) {
    console.log('inside setupService/setupInsertStudent');
    let students_dict = student;
     
     var student_array = [];
     for (const [key, value] of Object.entries(students_dict)) {
         student_array.push(value);
       }
       var student_array2 = [];
       student_array2= student_array[0];
       var student_array_rows = [];
       var size = Object.keys(student_array2).length;
       //console.log(student_array2[0]);

       var i;
       for (i = 0; i < size; i++) {
         student_array_rows = student_array2[i];
         var student_array_rows3 = Object.values(student_array_rows);
         const student_object = {
             university_id: student_array_rows3[0],
             name: student_array_rows3[1],
             surname: student_array_rows3[2],
             city: student_array_rows3[3],
             email: student_array_rows3[4],
             birthday: student_array_rows3[5],
             SSN: student_array_rows3[6]
           };
           try {
             let id = await setupDao.setupInsertStudent({...student_object});
             //return id;
         } catch (error) {
             console.log(error)
             return errHandler(error);
         }
        }
      // console.log(user_object);
    }

    const setupInsertInternalCourse = async function(courses) {
        console.log('inside setupService/setupInsertInternalCourse');
        let courses_dict = courses;
         
         var course_array = [];
         for (const [key, value] of Object.entries(courses_dict)) {
            course_array.push(value);
           }
           var course_array2 = [];
           course_array2= course_array[0];

           var course_array_rows = [];
           var size = Object.keys(course_array2).length;
           var i;
           for (i = 0; i < size; i++) {
             course_array_rows = course_array2[i];
             var course_array_rows3 = Object.values(course_array_rows);
             const course_object = {
                 code: course_array_rows3[0],
                 year: course_array_rows3[1],
                 semester: course_array_rows3[2],
                 course: course_array_rows3[3],
                 teacher: course_array_rows3[4]
               };
               try {
                 let id = await setupDao.setupInsertInternalCourse({...course_object});
                 //return id;
             } catch (error) {
                 console.log(error)
                 return errHandler(error);
             }
     
     
     }
     }

     const setupInsertInternalEnrollment = async function(enrollment) {
        console.log('inside setupService/setupInsertInternalEnrollment');
        let enrollment_dict = enrollment;
         
         var enrollment_array = [];
         for (const [key, value] of Object.entries(enrollment_dict)) {
            enrollment_array.push(value);
           }
           var enrollment_array2 = [];
           enrollment_array2= enrollment_array[0];

           var enrollment_array_rows = [];
           var size = Object.keys(enrollment_array2).length;
           var i;
           for (i = 0; i < size; i++) {
            enrollment_array_rows = enrollment_array2[i];
             var enrollment_array_rows3 = Object.values(enrollment_array_rows);
             const enrollment_object = {
                 code: enrollment_array_rows3[0],
                 student: enrollment_array_rows3[1]
               };
               try {
                 let id = await setupDao.setupInsertInternalEnrollment({...enrollment_object});
                 //return id;
             } catch (error) {
                 console.log(error)
                 return errHandler(error);
             }
     }
     }

     const setupInsertInternalSchedule = async function(schedule) {
        console.log('inside setupService/setupInsertInternalSchedule');
        let schedule_dict = schedule;
         
         var schedule_array = [];
         for (const [key, value] of Object.entries(schedule_dict)) {
            schedule_array.push(value);
           }
           var schedule_array2 = [];
           schedule_array2= schedule_array[0];

           var schedule_array_rows = [];
           var size = Object.keys(schedule_array2).length;
           var i;
           for (i = 0; i < size; i++) {
            schedule_array_rows = schedule_array2[i];
             var schedule_array_rows3 = Object.values(schedule_array_rows);
             const schedule_object = {
                 code: schedule_array_rows3[0],
                 room: schedule_array_rows3[1],
                 day: schedule_array_rows3[2],
                 seats: schedule_array_rows3[3],
                 time: schedule_array_rows3[4]
               };
               try {
                 let id = await setupDao.setupInsertInternalSchedule({...schedule_object});
                 //return id;
             } catch (error) {
                 console.log(error)
                 return errHandler(error);
             }
     }
     }


 // for (const [key, value] of Object.entries(teacher)) {
    //     console.log(`${key}: ${value}`);
    //     console.log('inside for object loop')

    //   }

    // for (eachUser of teacher){
    //     console.log('inside for eachUserloop')

    //     console.log(eachUser)

    // }
 //console.log(teacher);    
    //console.log(univesity_id);
    //teacher_dict_value=teacher_dict.values();


/*
const deleteUsers = async function(){
    try {
        return userDao.deleteUsersTable();
    } catch (error) {
        return errHandler(error);
    }
}
*/
module.exports = {setupInsertTeacher,setupInsertStudent,setupInsertInternalCourse,setupInsertInternalEnrollment,setupInsertInternalSchedule};



