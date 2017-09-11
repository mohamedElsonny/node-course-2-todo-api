const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        minlength: 1
    }
});

let User = mongoose.model('User', UserSchema);

module.exports = { User };