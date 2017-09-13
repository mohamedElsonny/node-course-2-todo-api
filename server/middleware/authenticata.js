var { User } = require('./../models/users');

module.exports = {
    authenticate(req, res, next) {
        let token = req.header('x-auth');

        User.findByToken(token)
            .then((user) => {
                if (!user) {
                    return Promis.reject();
                }

                req.user = user;
                req.token = token;
                next();
            }).catch((e) => {
                res.status(401).send();
            });
    }
};