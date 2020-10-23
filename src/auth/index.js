require('dotenv').config();
const User = require('../mongo/entities/user');
const passport = require('./passportConfig');
const jwt = require('jsonwebtoken');

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
          return res.status(401).send({
            success: false,
            message: error.message,
          });
        }
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

  app.post('/test', passport.authenticate(process.env.JWT_SCHEME, { session: false }), (req, res) => {
    res.json({
      t: 1
    })
  });
}

