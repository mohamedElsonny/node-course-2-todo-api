const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail, // it is like function(value) and passing the value in it
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});




UserSchema.methods = {

    toJSON() {
        var user = this;
        var userObject = user.toObject();

        return _.pick(userObject, ['_id', 'email']);
    },

    generateAuthToken() {
        var user = this;
        var access = 'auth';
        var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();

        user.tokens.push({ access, token });

        return user.save().then(() => token);
    }
};

UserSchema.statics = {
    findByToken(token) {
        var User = this;
        var decoded;

        try {
            decoded = jwt.verify(token, 'abc123');
        } catch (e) {
            return Promise.reject();
        }
        return User.findOne({
            '_id': decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth'
        });


    }
};

UserSchema.pre('save', function(next) {
    var user = this;


    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;

                next();
            });
        });
    } else {
        next();
    }
});


let User = mongoose.model('User', UserSchema);

module.exports = { User };