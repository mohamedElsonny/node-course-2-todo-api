const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todos');
const { User } = require('../server/models/users');


const userId = '59b5fe5ac48f2c0ddcfe0542';






User.findById(userId)
    .then((user) => {
        if (!user) {
            console.log('User Not Found');
        }

        console.log('User :', JSON.stringify(user, undefined, 2));
    }).catch(e => console.log(e.message));






// const id = '59b69791939b8b1570c84d8011';

// Todo.find({
//     _id: id
// }).then((todos) => {
//     if (todos.length === 0) {
//         return console.log('Id not found');
//     }
//     console.log('todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('todo', todo);
// });

// Todo.findById(id)
//     .then((todo) => {
//         if (!todo) {
//             return console.log('Id not found')
//         }
//         console.log('todo by Id', todo);
//     }).catch(e => console.log(e));