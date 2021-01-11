process.env.NODE_ENV = 'test';

const chai = require('chai');
const server = require('../index');
const should = chai.should();
const dbUtils = require('../utils/db');
const User = require('../models/user');
const userDao = require('../daos/user_dao');

const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const login = async function (newUser){
    try {
        await userDao.insertUser(newUser);
    }   catch(err) {}
    let credentials = { email: newUser.email, password: newUser.password };
    return  await chai.request(server).post(`/api/login`).send(credentials);
}
const checkStatus = async function (res,newUser){
    should.exist(res);
    res.should.have.status(200);
    res.body.should.be.an('object');
    const { university_id,email,name,surname,role } = newUser;
    const {hash, ...response} = new User(res.body.id, university_id, email, "filling hash field", name, surname, role);
    res.body.should.include(response);
    res.should.have.cookie('token')
}

const wrongCredentials = (res) => {
    should.exist(res);
    res.should.have.status(400);
    res.body.should.be.an('object');
    const response = { message: 'Username or password is incorrect' };
    res.body.should.be.eql(response);
};

describe('Authentication routes', function () {
    before('create table and clear db', async function() {
        await userDao.createUsersTable();
    });

    beforeEach('clear db', async function() {
        await userDao.clearUserTable();
    });

    
    it('should allow existing user to login', async function() {
        const newUser = dbUtils.studentObj('S123456');
        const res = await login(newUser);
        await checkStatus(res,newUser);
    });
    
    it('should allow an existing officer to login', async function() {
        await dbUtils.addStaff();
        const newUser = dbUtils.support_officerObj;
        const res = await login(newUser)
        await checkStatus(res,newUser)        
    });

    it('should allow an existing manager to login', async function() {        
        await dbUtils.addStaff()
        await userDao.clearUserTable()
        const newUser = dbUtils.managerObj;       
        const res = await login(newUser);
        await checkStatus(res,newUser);
    });
    
    it('should allow logged user to logout', async function() {
        const newUser = dbUtils.studentObj('S123456');
        await userDao.insertUser(newUser);
        const credentials = (({email, password}) => ({email, password}))(newUser);
        const agent = chai.request.agent(server);
        await agent.post(`/api/login`).send(credentials);
        const res = await agent.post(`/api/logout`).send();
        should.exist(res);
        res.should.have.status(200);
    });

    it('should deny non logged user to logout', async function() {
        const agent = chai.request.agent(server);
        const res = await agent.post(`/api/logout`).send();
        should.exist(res);
        res.should.have.status(401);
        res.body.should.be.an('object');
        const response = { message: 'Invalid Token' };
        res.body.should.be.eql(response);
    });

    describe('Wrong credentials', function() {
        it('should deny login on non existing email', async function() {
            const credentials = { email: "notexisting@email.com", password: "useless"}
            const res = await chai.request(server).post(`/api/login`).send(credentials);
            wrongCredentials(res);
        });

        it('should deny login on wrong password', async function() {
            const newUser = dbUtils.studentObj('S123456');
            await userDao.insertUser(newUser);
            const credentials = (({email}) => ({email, password: "wrong password"}))(newUser);
            const res = await chai.request(server).post(`/api/login`).send(credentials);
            wrongCredentials(res);
        });
    });
});
