const express = require('express');
const router = express.Router();

const dbUtils = require('../utils/db');
const userDao = require('../daos/user_dao');

router.post('/test/users', async (req, res) => {
    const { userType, options } = req.body;
    if (options && options.clear) {
        await dbUtils.reset({ create: true });
    }
    const user = userType === "student"
        ? dbUtils.studentObj('s12345')
        : dbUtils.teacherObj('s12345');
    await userDao.insertUser(user);
    return res.json(user);
});

router.post('/test/clear', async (req, res) => {
    await dbUtils.reset({ create: true });
    return res.json();
});

module.exports = router;