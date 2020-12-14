//import modules
//const { query } = require('express');
const {query,validationResult} = require('express-validator');

exports.checkTime = [
    query('from').optional().isDate(),
    query('to').optional().isDate(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(422).json({errors: errors.array()});
        next();
      },

];