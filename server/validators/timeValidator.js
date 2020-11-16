//import modules
//const { query } = require('express');
const {query,validationResult} = require('express-validator');

exports.checkTime = [
    query('start_date').isDate(),
    query('end_date').isDate(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(400).json({errors: errors.array()});
        next();
      },

];