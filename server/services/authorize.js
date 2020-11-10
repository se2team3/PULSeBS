const jwt = require('express-jwt');
const { secret } = require('../config/secret.json');

const authorize = (role= "") => {
    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'], getToken: req => req.cookies.token }),

        // authorize based on user role
        (req, res, next) => {
            if (role.length && role !== req.user.role) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            next();
        }
    ];
}

module.exports = authorize;