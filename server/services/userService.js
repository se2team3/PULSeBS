const sleep = require('../utils/sleep');
const userDao  = require('../daos/user_dao');
const errHandler = require('./errorHandler');
// harcoded users
/*const users = [
    { id: 1, username: "user1", password: "pass1", role: "Student" },
    { id: 2, username: "user2", password: "pass2", role: "Student" },
    { id: 3, username: "user3", password: "pass3", role: "Teacher" },
    { id: 4, username: "user4", password: "pass4", role: "Booking Manager" },
    { id: 5, username: "user5", password: "pass5", role: "Support Officer" },
    { id: 6, username: "user6", password: "pass6", role: "Student" },
];*/
const login = async ({username, password}) => {
    // TODO: is this necessary?
    // sleep for a while
    await sleep(1);
    // check credentials
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const { password, ...withoutPassword } = user;
        return { ...withoutPassword };
    }
};

// test purpose
const addUser = (user) => users.push(user);
const clearUsers = () => users.splice(0, users.length);
/*
    TODO implement the login part using the db
*/
const createUserTable = async function() {    
    try{
        return userDao.createUsersTable();
    }catch(err){
        return errHandler(err);
    }
}

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

const getUser = async function(user_id) {
    try {
        let user = await userDao.retrieveUser(user_id);
        return user;
    } catch (error) {
        return errHandler(error);
    }
}

const deleteUsers = async function(){
    try {
        return userDao.deleteUsersTable();
    } catch (error) {
        return errHandler(error);
    }
}

module.exports = { login, addUser, clearUsers, createUserTable, getUser, insertUser, deleteUsers};
