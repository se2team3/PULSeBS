const userDao  = require('../daos/user_dao');
const errHandler = require('./errorHandler');
const bcrypt = require("bcrypt");

const login = async ({email, password}) => {
    const retrievedUser = await userDao.retrieveUserByEmail(email);
    if (!retrievedUser)
        return null;
    const { hash, ...user } = retrievedUser;
    return await bcrypt.compare(password, hash)
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



/*
const deleteUsers = async function(){
    try {
        return userDao.deleteUsersTable();
    } catch (error) {
        return errHandler(error);
    }
}
*/
module.exports = { login, getUser, insertUser};
