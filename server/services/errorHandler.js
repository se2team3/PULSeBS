/**
 * Middleware functions that is called either as the last function in the express chain or when explicitly invoked
 * @param {string|object} err - is the type of error
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function errorHandler(err, req, res, next) {
    if(!res){//If there is no request propagate to an higher level
        throw { message: err };
    }

    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}

module.exports = errorHandler;