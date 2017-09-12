const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todos');
const { User } = require('../server/models/users');

const { ObjectID } = require('mongodb');

// Todo.remove({})
//     .then((result) => {
//         console.log(result);
//     });


// Todo.findOneAndRemove({ _id: '59b751018f59a1150458e94a' })
//     .then((todo) => {
//         console.log(todo);
//     });

Todo.findByIdAndRemove('59b7516e5c34fe0e5cc36570')
    .then((todo) => console.log(todo));