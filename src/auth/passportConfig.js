require('dotenv').config();
const passport = require('passport')
const passportJWT = require('passport-jwt');
const User = require('../mongo/entities/user');
/*****  Configure passport  *******/
// passport & jwt config
const {
    Strategy: JWTStrategy,
    ExtractJwt: ExtractJWT,
} = passportJWT;
// define passport jwt strategy
const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme(process.env.JWT_SCHEME);
opts.secretOrKey = process.env.JWT_SECRET_OR_KEY;
const passportJWTStrategy = new JWTStrategy(opts, function (jwtPayload, done) {
    // get email from jwt payload
    const email = jwtPayload.email;
    User.findOne({ email: email }, (error, user) => {
        if (error) {
            return done(error, false);
        } else {
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        }
    });
});
passport.use(passportJWTStrategy);

module.exports = passport;