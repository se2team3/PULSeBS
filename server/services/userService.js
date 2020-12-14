const sleep = require('../utils/sleep');
const userDao  = require('../daos/user_dao');
const errHandler = require('./errorHandler');
const bcrypt = require("bcrypt");

const login = async ({email, password}) => {
    // TODO: is this necessary?
    // sleep for a while
    //await sleep(1);
    // check credentials
    const user = await userDao.retrieveUserByEmail(email);
    return user && await bcrypt.compare(password, user.hash)
        ? user
        : null;
};

/*
    TODO implement the login part using the db
*//*
const createUserTable = async function() {    
    try{
        return userDao.createUsersTable();
    }catch(err){
        return errHandler(err);
    }
}
*/
const insertUser = async function(user) {

    //let {univesity_id,email,password,name,surname,role} = user;
    try {
        let id = await userDao.insertUser({...user});
        return id;
    } catch (error) {
        console.log(error)
        return errHandler(error);
    }
}

const setupInsertTeacher = async function(teacher) {
   console.log('inside setupInsertteacher');
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
            let id = await userDao.setupInsertTeacher({...teacher_object});
            //return id;
        } catch (error) {
            console.log(error)
            return errHandler(error);
        }


}
      console.log(user_object);

  
}


const setupInsertStudent = async function(student) {
    console.log('inside setupInsertStudent');
    let students_dict = student;
     
     
     var student_array = [];
     for (const [key, value] of Object.entries(students_dict)) {
         student_array.push(value);
       }
       var student_array2 = [];
       student_array2= student_array[0];
       var student_array_rows = [];
       var size = Object.keys(student_array2).length;
       console.log(student_array2[0]);

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
             let id = await userDao.setupInsertStudent({...student_object});
             //return id;
         } catch (error) {
             console.log(error)
             return errHandler(error);
         }
 
 
 }
       console.log(user_object);
 
   
 }


const getUser = async function(user_id) {
    try {
        let user = await userDao.retrieveUser(user_id);
        return user;
    } catch (error) {
        return errHandler(error);
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
module.exports = { login, getUser, insertUser,setupInsertTeacher,setupInsertStudent};
