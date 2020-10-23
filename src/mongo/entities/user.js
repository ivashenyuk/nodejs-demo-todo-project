const mongoose = require('./../mongoose-connection');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const UserSchema = new Schema({
    email: String,
    password: String,
    token: String,
});

// pre saving user
UserSchema.pre('save', function (next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (error, salt) {
            // handle error
            if (error) return next(error);

            // hash the password using our new salt
            bcrypt.hash(user.password, salt, function (error, hash) {
                // handle error
                if (error) return next(error);

                // override the cleartext password with the hashed one
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  };

UserSchema.statics.isValid = function (req) {
    if (req) {
        const email = req.body.email || '';
        const password = req.body.password || '';

        if (email && password && String(password).length > 6) {
            return true;
        }
    }
    return false;
}

module.exports = mongoose.model('User', UserSchema);