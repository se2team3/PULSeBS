const express = require('express');
const app = express.Router();
const userService = require('../services/userService');
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config/secret.json');
const authorize = require('../services/authorize');

/**
 * @swagger
 * /login:
 *  post:
 *    tags:
 *      - authenticate
 *    summary: "Log into the system"
 *    description: "Grant access to the protected routes, after providing correct credentials"
 *    consumes:
 *       - "application/json"
 *    produces:
 *       - "application/json"
 *    parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Credential object"
 *        required: true
 *        schema:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *    responses:
 *       "200":
 *         description: "Successful logged in"
 *         schema:
 *           type: "object"
 *           properties:
 *              id:
 *                  type: int
 *                  description: "Unique ID of the logged user"
 *              username:
 *                  type: string
 *                  description: "Username of the logged user"
 *              role:
 *                  type: string
 *                  description: "Specifies the role of the logged user"
 *       "400":
 *         description: "Invalid credentials"
 *         schema:
 *           type: "object"
 *           properties:
 *              message:
 *                  type: string
 *                  description: "Error message"
 */
app.post(`/login`, login);

/**
 * @swagger
 * /logout:
 *  post:
 *    tags:
 *      - authenticate
 *    summary: "Log out the system"
 *    description: "Log out by clearing the cookie related to the JWT token"
 *    consumes:
 *       - "application/json"
 *    responses:
 *       "200":
 *         description: "Successful logged out"
 *       "401":
 *         description: "Not authorized"
 *         schema:
 *           type: "object"
 *           properties:
 *              message:
 *                  type: string
 *                  description: "Error message"
 */
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