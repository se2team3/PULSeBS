const express = require('express');
const app = express.Router();
const userService = require('../services/user');
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config/secret.json');
const authorize = require('../services/authorize');

app.post(`/login`, login);
app.post(`/logout`, authorize(), logout);

async function login(req, res) {
    const user = await userService.login(req.body);
    if (!user)
        return res.status(400).json({ message: 'Username or password is incorrect' });
    const token = jsonwebtoken.sign({ sub: user.id, role: user.role }, secret);
    res.cookie('token', token, {httpOnly: true, sameSite: true, maxAge: 1000 * 300 /*5 min*/});
    return res.json(user);
}

async function logout(req, res) {
    return res.clearCookie('token').end();
}

module.exports = app;