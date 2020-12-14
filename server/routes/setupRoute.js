const express = require('express');
const app = express.Router();
const setupService = require('../services/setupService');
const bookingService = require('../services/bookingService');
const userService = require('../services/userService');
const setupDao = require('../daos/setup_dao');
const authorize = require('../services/authorizeService');
const role = require('../utils/roles');
const moment = require('moment');
//const router = express.Router();
//const studentService = resquire('../services/studentService');
//const bookingService = require('../services/bookingService')
const timeValidator = require('../validators/timeValidator');
const {validator,lectureValidation }= require('../validators/validator');

app.post('/setup', async(req,res) =>{
    //res.send('debug: setup endpoint reached');
    //res.send('debug: setup endpoint reached:'+req.query.json())

    const courses_dict = req.body.courses;
    const enrollment_dict = req.body.enrollment;
    const schedule_dict = req.body.schedule;
    const students_dict = req.body.students;
    const teachers_dict = req.body.teachers;
    console.log('inside setupRoute');

    try{    

        console.log('inside try catch setupRoute');
        let teachers = await userService.setupInsertTeacher({teachers_dict});
        console.log(teachers);
        return res.status(201);
    } catch(error){
        res.status(400).json(error);
    }
    try{    
        console.log('inside try catch setupRoute');
        let students = await userService.setupInsertStudent({students_dict});
        console.log(students);
        return res.status(201);
    } catch(error){
        res.status(400).json(error);
    }

    //const student_id= +req.params.student_id;
 
})


app.post('/setup2', async(req,res) =>{
    //res.send('debug: setup endpoint reached');
    //res.send('debug: setup endpoint reached:'+req.query.json())

    const {courses_dict} = req.body.courses;
    const {enrollment_dict} = req.body.enrollment;
    const {schedule_dict} = req.body.schedule;
    const {students_dict} = req.body.students;
    const {teachers_dict} = req.body.teachers;
    //console.log(json(courses_dict))


    //const student_id= +req.params.student_id;
    try{
        let courses = await setupService.insertCourses({courses_dict});
        return res.status(201);
    } catch(error){
        res.status(400).json(error);
    }

    try{
        let enrollment = await setupService.insertEnrollment({enrollment_dict});
        return res.status(201);
    } catch(error){
        res.status(400).json(error);
    }

    try{
        let schedule = await setupService.insertSchedule({schedule_dict});
        return res.status(201);
    } catch(error){
        res.status(400).json(error);
    }

    try{
        let students = await setupService.insertStudents({students_dict});
        return res.status(201);
    } catch(error){
        res.status(400).json(error);
    }

    try{
        let teachers = await setupService.insertTeachers({teachers_dict});
        return res.status(201);
    } catch(error){
        res.status(400).json(error);
    }
})




app.get('/setup', async(req,res) =>{
   // let student_id = +req.params.test;
    //const {from, to} = req.query;
    try{
        //let lectures = await studentService.getStudentLectures(student_id, from, to);
        //return res(student_id);
       //return res.send('<h1>est kontakt</h1>');
       res.send('Response send to client::'+req.query.test);

       //res.send(student_id);

        //return res.status(200).json(lectures);
    } catch(error){
        res.status(400).json(error);
    }
})

module.exports = app;