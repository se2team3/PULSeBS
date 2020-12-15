const sleep = require('../utils/sleep');
const userDao  = require('../daos/user_dao');
const errHandler = require('./errorHandler');
const bcrypt = require("bcrypt");

const login = async ({email, password}) => {
    // check credentials
    const { hash, ...user} = await userDao.retrieveUserByEmail(email);
    return user && await bcrypt.compare(password, hash)
        ? user
        : null;
};

const insertUser = async function(user) {
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
        let { hash, ...user } = await userDao.retrieveUser(user_id);
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
