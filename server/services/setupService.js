const userDao  = require('../daos/user_dao');
const lectureDao = require('../daos/lecture_dao');
const courseDao = require('../daos/course_dao');
const roomDao = require('../daos/room_dao');
const enrollmentDao = require('../daos/course_student_dao');
const dbUtils = require('../utils/db')
//const bulkDao = require('../dao/bulk_dao')
const moment = require('moment')


async function insertTeachers(teachers_dict){
  //university_id=Number,email=OfficalEmail,password=?,name=GivenName, surname=Surname,role=?
  let teacher_id =[]
  let teachers = teachers_dict.map((t)=>{
    return {university_id: t.Number, email:t.OfficialEmail, password:'passw0rd', name:t.GivenName, surname: t.Surname, role:'teacher'}
  })
  
  teacher_id = await userDao.bulkInsertionUsers(teachers)
  /* for (let t of teachers_dict){
      let teacher = {university_id: t.Number, email:t.OfficialEmail, password:'passw0rd', name:t.GivenName, surname: t.Surname, role:'teacher'}
      let res_id=await userDao.insertUser(teacher);
      teacher_id.push({university_id: t.Number,id:res_id})
  } */
  return teacher_id;
}

async function insertStudents(students_dict){
  //university_id=Id,email=OfficalEmail,password=?,name=Name, surname=Surname,role=?
  let student_id =[];
  let students = students_dict.map((t)=>{
    return {university_id:t.Id, email:t.OfficialEmail, password:'passw0rd', name:t.Name, surname: t.Surname, role:'student'}
  })
  /* for (let s of students_dict){
      let student = {university_id: s.Id, email:s.OfficialEmail, password:'passw0rd', name:s.Name, surname:s.Surname, role:'student'}
      let res_id = await userDao.insertUser(student);
      student_id.push({university_id:s.Id, id:res_id}) 
  } */
  student_id=await userDao.bulkInsertionUsers(students)
  return student_id;
}


async function insertCourses(courses_dict,teacher_id){
  //code=Code,name=Course, teacher_id=Teacher,year=Year,semester=Semester
  let t_id=teacher_id.map((el)=>el.university_id)
  let course_id = [];
  for(let c of courses_dict){
  
    if(!t_id.includes(c.Teacher)){
        //await dbUtils.reset();
        throw 'Teacher id is not present'
    }
  }
 

      let courses = courses_dict.map((c) => {
        num=t_id.indexOf(c.Teacher)
        
        return {code:c.Code, name:c.Course, teacher_id:teacher_id[num].id, year:c.Year, semester:c.Semester}
      }) 
   
      let courses_id = await courseDao.bulkInsertionCourses(courses);
      
      //course_id.push({course_code:c.Code, course_id:res_id, semester: c.Semester});
      
  return courses_id
}

async function insertEnrollments(enrollment_dict,course_id,student_id){
  //course_id=Code, student_id=Student
  let s_id=student_id.map((el)=>el.university_id)
  let c_id=course_id.map((el)=>el.course_code)
  for(let e of enrollment_dict){
    
    if(s_id.includes(e.Student) && c_id.includes(e.Code)){
      let enrollment = {course_id:e.Code,student_id:e.Student}
      await enrollmentDao.assingCourseToStudent(enrollment);
    }
    else{
     // await dbUtils.reset();
      throw 'Student or course id is not present'
    }
    
  }
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
  //datetime:da costruire, datetime_end: da costruire, course_id:Code(map),room_id:Room(map)
    await insertRooms(schedule_dict); console.log('rooms')
    let c_id=course_id.map((el)=>el.course_code)
    for (let sd of schedule_dict){
      
      if(c_id.includes(sd.Code)){
         await replicateSchedule(sd,course_id)
      }
      else{
      //  await dbUtils.reset();
        throw 'Course id is not present' 
      }
    
    }
}

async function replicateSchedule(sd,courses){
    let startDate, endDate;
    let course= courses.filter((c)=>c.course_code===sd.Code)
    if(course.semester === 1){
      startDate =  moment('2020-10-01','YYYY-MM-DD');    
      endDate =  moment('2021-01-31','YYYY-MM-DD');
    }
    else{
      startDate =  moment('2021-03-01','YYYY-MM-DD');    
      endDate =  moment('2021-06-30','YYYY-MM-DD');
    }
    
    let days={Mon:1, Tue:2, Wed:3, Thu:4, Fri:5}
    let tmp = startDate.clone().day(days[sd.Day]); //takes the first day_of_week (ex the first Monday)
    
    while(tmp.isBefore(endDate)){ 
      let time = sd.Time.split('-') 
      let date1 = moment(tmp + time[0], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD hh:mm')
      let date2 = moment(tmp+ time[1],'YYYY-MM-DD hh:mm').format('YYYY-MM-DD hh:mm')
      const lecture = {datetime:date1, datetime_end:date2, course_id:course[0].course_id,room_id:sd.Room} 
      await lectureDao.insertLecture(lecture);     
      tmp.add(7, 'days'); //iterates for example every monday
    }
}




const setupInsert = async function(dictionary) {

    const teachers_dict = dictionary.teachers;
    const students_dict = dictionary.students;
    const courses_dict = dictionary.courses;
    const enrollment_dict = dictionary.enrollment;
    const schedule_dict = dictionary.schedule;

    await dbUtils.reset();

    
    let teacher_id =[], student_id=[],course_id=[];
    console.log("sono qui")
    teacher_id = await insertTeachers(teachers_dict) ; console.log('teachers')
    student_id = await insertStudents(students_dict); console.log('students') 
    //course_id = await insertCourses(courses_dict,teacher_id); console.log('courses')
    /*await insertEnrollments(enrollment_dict,course_id,student_id); console.log('enroll')
    await insertSchedule(schedule_dict,course_id); console.log('end')
    */

  
}







module.exports = {setupInsert};



