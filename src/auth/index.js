require('dotenv').config();
const User = require('../mongo/entities/user');
const passport = require('passport')
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
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

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());


  app.post('/login', (req, res) => {
    const email = req.body.email || '';
    const password = req.body.password || '';

    if (email && password) {
      User.findOne({ email: email }, (error, user) => {
        // check if user exist
        if (error) {
          res.status(401).send({
            success: false,
            message: error.message,
          });
        } else {
          if (!user) {
            return res.status(401).send({
              success: false,
              message: 'The user not exists!',
            });
          }
          // check if password matches
          user.comparePassword(password, (error, isMatch) => {
            if (isMatch && !error) {
              // if user is found and password is right create a token
              const token = jwt.sign(
                user.toJSON(),
                process.env.JWT_SECRET_OR_KEY, {
                expiresIn: process.env.JWT_TOKEN_EXPIRATION,
              });

              // return the information including token as JSON
              return res.status(200).send({
                success: true,
                user: user,
                token: `${process.env.JWT_TOKEN_PREFIX} ${token}`,
              });
            }
            
            res.status(401).send({
              success: false,
              message: 'Wrong password or email!',
            });
          });
        }
      });
    } else {
      return res.status(401).send({
        success: false,
        message: 'VERIFY_REQUIRED_INFORMATION',
      });
    }
  })

  app.post('/registration', (req, res) => {
    if (User.isValid(req)) {
      const email = req.body.email || '';
      User.findOne({ email: email }, (error, user) => {
        if (error) {
          return res.status(401).send({
            success: false,
            message: error.message
          });
        }
        // create user if not exists
        if (!user) {
          const userModel = new User(req.body);
          userModel.save((errOnSaveUser) => {
            if (errOnSaveUser) {
              return res.status(401).send({
                success: false,
                message: error.message,
              });
            } else {
              res.status(200).send({
                success: true,
                user: userModel,
              });
            }
          })
        } else {
          // else sent response as user already exists
          res.status(403).send({
            success: false,
            message: 'The user already exists!'
          });
        }
      });
    } else {
      return res.status(400).send({
        success: false,
        message: 'The user data is invalid!'
      });
    }

  })
}

