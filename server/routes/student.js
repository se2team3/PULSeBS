const express = require('express');
const app = express.Router();
const studentService = require('../services/student');
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config/secret.json');
const authorize = require('../services/authorize');

app
    .post(`/login`, login)
    .get(`/restricted`, authorize("Student"), restrictedData);

async function login(req, res) {
    const user = await studentService.login(req.body);
    if (!user)
        res.status(400).json({ message: 'Username or password is incorrect' });
    const token = jsonwebtoken.sign({ sub: user.id, role: user.role }, secret);
    res.cookie('token', token, {httpOnly: true, sameSite: true, maxAge: 1000 * 300 /*5 min*/});
    return res.json(user);
}

async function restrictedData(req, res) {
    return res.json(await studentService.restrictedData());
}

module.exports = app;