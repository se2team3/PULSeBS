//import modules
const {body} = require('express-validator');

const checkLecture = () => {
    return [
        body('lecture_id').isInt({min: 0,allow_leading_zeroes: false}),
    ];
};
module.exports = {checkLecture};