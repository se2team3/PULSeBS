process.env.NODE_ENV = 'test';

const chai = require('chai');
const server = require('../index');
const should = chai.should();
const { insertUser } = require('../services/userService');
const dbUtils = require('../utils/db');
const User = require('../models/user');
const userDao = require('../daos/user_dao');

const chaiHttp = require("chai-http");

chai.use(chaiHttp);

describe('Authentication routes', function () {
    before('create table and clear db', async function() {
        await userDao.createUsersTable();
    });

    beforeEach('clear db', async function() {
        await userDao.clearUserTable();
    });

    after('clear db', async function() {
        await userDao.clearUserTable();
    });

    it('should allow existing user to login', async function() {
        const newUser = dbUtils.studentObj('S123456');
        const id = await insertUser(newUser);
        const credentials = (({email, password}) => ({email, password}))(newUser);
        const res = await chai.request(server).post(`/login`).send(credentials);
        should.exist(res);
        res.should.have.status(200);
        res.body.should.be.an('object');
        const { university_id,email,name,surname,role } = newUser;
        const {hash, ...response} = new User(id, university_id, email, "filling hash field", name, surname, role);
        res.body.should.include(response);
        res.should.have.cookie('token');
    });

    it('should allow logged user to logout', async function() {
        const newUser = dbUtils.studentObj('S123456');
        await insertUser(newUser);
        const credentials = (({email, password}) => ({email, password}))(newUser);
        const agent = chai.request.agent(server);
        await agent.post(`/login`).send(credentials);
        const res = await agent.post(`/logout`).send();
        should.exist(res);
        res.should.have.status(200);
    });

    it('should deny non logged user to logout', async function() {
        const agent = chai.request.agent(server);
        const res = await agent.post(`/logout`).send();
        should.exist(res);
        res.should.have.status(401);
        res.body.should.be.an('object');
        const response = { message: 'Invalid Token' };
        res.body.should.be.eql(response);
    });

    describe('Wrong credentials', function() {
        it('should deny login on non existing email', async function() {
            const credentials = { email: "notexisting@email.com", password: "useless"}
            const res = await chai.request(server).post(`/login`).send(credentials);
            wrongCredentials(res);
        });

        it('should deny login on wrong password', async function() {
            const newUser = dbUtils.studentObj('S123456');
            await insertUser(newUser);
            const credentials = (({email}) => ({email, password: "wrong password"}))(newUser);
            const res = await chai.request(server).post(`/login`).send(credentials);
            wrongCredentials(res);
        });
    });
});

describe('Reserved routes', function () {
    describe('Logged user', function () {
        let agent;

        before('clear db', async function() {
            await userDao.clearUserTable();
        });

        after('clear db', async function() {
            await userDao.clearUserTable();
        });

        beforeEach('Login as a new student', async function() {
            const newUser = dbUtils.studentObj('S123456');
            await insertUser(newUser);
            const credentials = (({email, password}) => ({email, password}))(newUser);
            agent = chai.request.agent(server);
            await agent.post(`/login`).send(credentials);
        })

        it('should retrieve student protected data from route', async function() {
            const res = await agent.get(`/restricted`);
            should.exist(res);
            res.should.have.status(200);
            res.body.should.be.an('object');
            const response = { name: "private", surname: "you can't see if not student" };
            res.body.should.be.eql(response);
        });
    });

    describe('Non logged user', function () {
        it('should not retrieve protected data from route', async function() {
            const res = await chai.request(server).get(`/restricted`);
            should.exist(res);
            res.should.have.status(401);
            res.body.should.be.an('object');
            const response = { message: 'Invalid Token' };
            res.body.should.be.eql(response);
        });
    });
});

const wrongCredentials = (res) => {
    should.exist(res);
    res.should.have.status(400);
    res.body.should.be.an('object');
    const response = { message: 'Username or password is incorrect' };
    res.body.should.be.eql(response);
};
