//import modules
//const { query } = require('express');
const {query,validationResult} = require('express-validator');

exports.checkTime = [
    query('from').isDate(),
    query('to').isDate(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(400).json({errors: errors.array()});
        next();
      },

];