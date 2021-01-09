const userDao  = require('../daos/user_dao');
const lectureDao = require('../daos/lecture_dao');
const courseDao = require('../daos/course_dao');
const roomDao = require('../daos/room_dao');
const enrollmentDao = require('../daos/course_student_dao');
const dbUtils = require('../utils/db')
const moment = require('moment')

async function insertTeachers(teachers_dict){
  let teacher_id =[]
  let teachers = teachers_dict.map((t)=>{
    return {university_id: t.Number, email:t.OfficialEmail, hash: '$2b$10$wZzLdBmlArdCD5c74hx6DeABg3ikmFYkj7Wff0B/DZnLYg4Rd1xOq', name:t.GivenName, surname: t.Surname, role:'teacher',
            ssn:t.SSN,city:null,birthday:null}
  })
  teacher_id = await userDao.bulkInsertionUsers(teachers)
  return teacher_id;
}

async function insertStudents(students_dict){
  let student_id =[];
  let students = students_dict.map((t)=>{
    return {university_id:t.Id, email:t.OfficialEmail, hash: '$2b$10$wZzLdBmlArdCD5c74hx6DeABg3ikmFYkj7Wff0B/DZnLYg4Rd1xOq', name:t.Name, surname: t.Surname, role:'student',
            ssn:t.SSN,city:t.City,birthday:t.Birthday}
  })
  student_id=await userDao.bulkInsertionUsers(students)
  return student_id;
}


async function insertCourses(courses_dict,teacher_id){
  let t_id=teacher_id.map((el)=>el.university_id)
  let course_id = [];
  for(let c of courses_dict){
    if(!t_id.includes(c.Teacher)){
      await dbUtils.reset();
      throw 'Teacher id is not present'
    }
  }
  let courses = courses_dict.map((c) => {
    num=t_id.indexOf(c.Teacher)      
    return {code:c.Code, name:c.Course, teacher_id:teacher_id[num].id, year:c.Year, semester:c.Semester}
  })
  let courses_id = await courseDao.bulkInsertionCourses(courses);
  return courses_id
}

async function insertEnrollments(enrollment_dict,course_id,student_id){
  let s_id=student_id.map((el)=>el.university_id)
  let c_id=course_id.map((el)=>el.code)
 
  for(let e of enrollment_dict){
  
    if(!(s_id.includes(e.Student) || c_id.includes(e.Code))){
        await dbUtils.reset();
      throw 'Teacher id is not present'
    }
  } 
  let enrolls = enrollment_dict.map((e) => {
  let ind1 = c_id.indexOf(e.Code);
  let ind2 = s_id.indexOf(e.Student)
    return {course_id:course_id[ind1].id,student_id:student_id[ind2].id}
  })   
  await enrollmentDao.bulkInsertionEnrollments(enrolls);    
  
}

async function insertRooms(schedule_dict){
  let rooms = [];
  for (let sd of schedule_dict){
    if(!rooms.includes({name:sd.Room, seats:sd.Seats})){
      let id = await roomDao.insertRoom({name:sd.Room, seats:sd.Seats})
      rooms.push({room_id:id, name:sd.Room, seats:sd.Seats})
    }
  }
}

async function insertSchedule(schedule_dict,course_id){
  let c_id=course_id.map((el)=>el.code)
 
  for (let sd of schedule_dict){  
    if(!c_id.includes(sd.Code)){
      await dbUtils.reset();
      throw 'Course id is not present' 
    }    
  }
  await insertRooms(schedule_dict); console.log('rooms')
  replicateSchedule(schedule_dict,course_id)
}

async function replicateSchedule(schedules,courses){
  let lectures = []
  for(let sd of schedules ){
    let startDate, endDate;
    let course= courses.filter((c)=>c.code===sd.Code)
    if(course.semester === 1){
      startDate =  moment('2020-10-01','YYYY-MM-DD');    
      endDate =  moment('2021-01-31','YYYY-MM-DD');
    }
    else{
      startDate =  moment('2021-03-01','YYYY-MM-DD');    
      endDate =  moment('2021-06-30','YYYY-MM-DD');
    }
    
    let days={Mon:1, Tue:2, Wed:3, Thu:4, Fri:5}
    //let tmp = startDate.clone().day(days[sd.Day]); //takes the first day_of_week (ex the first Monday)
    
    while(startDate.isBefore(endDate)){ 
      let time = sd.Time.split('-') 

      let date1 = moment(startDate, 'YYYY-MM-DD hh:mm').add(time[0],'hh:mm').format('YYYY-MM-DD HH:mm')
      let date2 = moment(startDate ,'YYYY-MM-DD').add(time[1],'hh:mm').format('YYYY-MM-DD HH:mm')

      const lecture = {datetime:date1, datetime_end:date2, course_id:course[0].id,room_id:sd.Room} 
      lectures.push(lecture);     
      startDate.add(7, 'days');
    }
  }
    await lectureDao.bulkInsertionLectures(lectures);  
}




const setupInsert = async function(dictionary) {

    const teachers_dict = dictionary.teachers;
    const students_dict = dictionary.students;
    const courses_dict = dictionary.courses;
    const enrollment_dict = dictionary.enrollment;
    const schedule_dict = dictionary.schedule;

    await dbUtils.reset();
    await dbUtils.addStaff();

    
    let teacher_id =[], student_id=[],course_id=[];

    teacher_id = await insertTeachers(teachers_dict) ; console.log('teachers')
    student_id = await insertStudents(students_dict); console.log('students') 
    course_id = await insertCourses(courses_dict,teacher_id); console.log('courses')
    await insertEnrollments(enrollment_dict,course_id,student_id); console.log('enroll')
    await insertSchedule(schedule_dict,course_id); console.log('schedule')
    await dbUtils.bookLectures(); console.log("bookings and deletions")
    
    

  
}







module.exports = {setupInsert};



