let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TodoSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

let Todo = mongoose.model('Todo', TodoSchema);

module.exports = { Todo };