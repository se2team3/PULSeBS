// import modules
const { validationResult } = require('express-validator');

// import validation rules
const lectureValidation = require('./lectureValidator');

// validator Middleware
const validator = (req, res, next) => {
    //console.log(req.body);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({[err.param]: err.msg}));

    return res.status(422).json({
        errors: extractedErrors
    });
};

module.exports = { validator, lectureValidation };