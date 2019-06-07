
const errors = require('restify-errors');
const User = require("../models/User")
const bcrypt = require('bcrypt')
const auth = require("../auth")
const jwt = require('jsonwebtoken')
const config = require("../config")

module.exports = server => {
    //Register User

    server.post('/register', (req, res, next) => {
        const { email, password } = req.body;
        const user = new User({
            email,
            password
        })

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, async (err, hash) => {
                //Hash Password
                user.password = hash;
                try {
                    const newUser = await user.save();
                    res.send(201)
                    next()
                } catch (err) {
                    return next(new errors.InternalError(err.message));
                }

            })
        })

    })

    server.post('/auth', async (req, res, next) => {
        const { email, password } = req.body;
        //Authenticate User
        auth.authenticate(email, password).then(user => {

            const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
                expiresIn: '15m'
            });
            const { iat, exp } = jwt.decode(token);
            // Respond with token
            res.send({ iat, exp, token });

            next();

        }).catch(error => {
            return next(new errors.UnauthorizedError(error))
        })


        //User Unauthorized
    })
}


