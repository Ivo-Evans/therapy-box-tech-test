
const userModels = require("../../db/models/users.js")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');

function signup(req, res, next) {
    const {password, email, username} = req.body
    if (!(password && email && username)) {
        const err = new Error("password, email and username are required")
        err.code = 400
        return next(err)
     }
    bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(req.body.password, salt))
        .then(password_slug => {
            userModels.postUser({...req.body, password_slug})
                .then((result) => {
                    const token = jwt.sign(
                        { users_id: result.rows[0].id },
                        process.env.SECRET,
                        { expiresIn: '24h' },
                    );
                    res.status(200).send({token})
                })
        })
        .catch(next)
}
module.exports = signup