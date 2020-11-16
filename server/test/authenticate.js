/*process.env.NODE_ENV = 'test';

const chai = require('chai');
const server = require('../index');
const should = chai.should();
const { addUser, clearUsers } = require('../services/user');

const chaiHttp = require("chai-http");

chai.use(chaiHttp);

describe('Authentication routes', function () {
    beforeEach('Clear user db', async function() {
        clearUsers()
    });

    it('should allow existing user to login', async function() {
        const newUser = { id: 123, username: "my_user", password: "Secret!;;0", role: "Student" };
        addUser(newUser);
        const credentials = (({username, password}) => ({username, password}))(newUser);
        const res = await chai.request(server).post(`/login`).send(credentials);
        should.exist(res);
        res.should.have.status(200);
        res.body.should.be.an('object');
        const response = (({username, id, role}) => ({username, id, role}))(newUser);
        res.body.should.be.eql(response);
        res.should.have.cookie('token');
    });

    it('should allow logged user to logout', async function() {
        const newUser = { id: 123, username: "my_user", password: "Secret!;;0", role: "Student" };
        addUser(newUser);
        const credentials = (({username, password}) => ({username, password}))(newUser);
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
        it('should deny login on non existing username', async function() {
            const newUser = { id: 123, username: "my_user", password: "Secret!;;0", role: "Student" };
            addUser(newUser);
            const credentials = (({username, password}) => ({username: "wrong_username", password}))(newUser);
            const res = await chai.request(server).post(`/login`).send(credentials);
            wrongCredentials(res);
        });

        it('should deny login on wrong password', async function() {
            const newUser = { id: 123, username: "my_user", password: "Secret!;;0", role: "Student" };
            addUser(newUser);
            const credentials = (({username, password}) => ({username, password: "wrong_passwd"}))(newUser);
            const res = await chai.request(server).post(`/login`).send(credentials);
            wrongCredentials(res);
        });
    });
});

describe('Reserved routes', function () {
    describe('Logged user', function () {
        let agent;

        beforeEach('Clear user db', function() {
            clearUsers()
        });

        beforeEach('Login as a new user', async function() {
            const newUser = { id: 123, username: "my_user", password: "Secret!;;0", role: "Student" };
            addUser(newUser);
            const credentials = (({username, password}) => ({username, password}))(newUser);
            agent = chai.request.agent(server);
            await agent.post(`/login`).send(credentials);
        })

        it('should retrieve protected data from route', async function() {
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
};*/