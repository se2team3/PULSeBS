const jwt = require('express-jwt');
const { secret } = require('../config/secret.json');

// TODO: we may want to use a set of roles (e.g. both Student and Teacher can access a resource)
/**
 * Middleware function that filters request based on the given role
 * @param {string} [role] - specifies the role that has access to the resource.
 *                          If empty lets all the logged users access the resource
 * @see utils/roles.js
 * @returns {[function(*=, *=, *): (*|undefined), function(*, *, *): (*|undefined)]}
 */
const authorizeService = (role= "") => {
    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'], getToken: req => req.cookies.token }),

        // authorizeService based on user role
        (req, res, next) => {
            if (role.length && role !== req.user.role) {
                // user's role is not authorized
                return res.status(403).json({ message: 'Forbidden' });
            }

            // authentication and authorization successful
            next();
        }
    ];
}

module.exports = authorizeService;
