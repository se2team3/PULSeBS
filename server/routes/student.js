const express = require('express');
const app = express.Router();

const studentService = require('../services/student');
const authorize = require('../services/authorize');
const role = require('../utils/roles');

/* cannot be used like this, because the authorization rule is then applied
 * to all the following routes (even in other modules)
 *
 *      app.use(authorize(role.Student));
 *
 */

app.get(`/restricted`, authorize(role.Student), restrictedData);

async function restrictedData(req, res) {
    return res.json(await studentService.restrictedData());
}

module.exports = app;