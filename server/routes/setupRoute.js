const express = require('express');
const app = express.Router();
const setupService = require('../services/setupService');
const setupDao = require('../daos/setup_dao');

//const studentService = require('../services/studentService');
//const bookingService = require('../services/bookingService')
const authorize = require('../services/authorizeService');
const role = require('../utils/roles');
const timeValidator = require('../validators/timeValidator');
const {validator,lectureValidation }= require('../validators/validator');



app.post('/setup', async(req,res) =>{
    const {courses_dict} = req.body.courses;
    const {enrollment_dict} = req.body.enrollment;
    const {schedule_dict} = req.body.schedule;
    const {students_dict} = req.body.students;
    const {teachers_dict} = req.body.teachers;

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




app.post('/setup/createTables', async(req,res) =>{
    //const {lecture_id} = req.body;
    //const student_id= +req.params.student_id;
    try{
        let createResult = await setupDao.createInternalCoursesTable();
        return res.status(201);
    } catch(error){
        res.status(400).json(error);
    }
})

module.exports = app;