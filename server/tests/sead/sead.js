const { ObjectID } = require('mongodb');
const { Todo } = require('../../models/todos');
const { User } = require('../../models/users');
const jwt = require('jsonwebtoken');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'mohElsonny@gmail.com',
    password: 'UserOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, acess: 'auth' }, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'Allaa@gmail.com',
    password: 'UserTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, acess: 'auth' }, 'abc123').toString()
    }]
}];



const todos = [{
    _id: new ObjectID(),
    text: 'First Todo',
    completed: false,
    completedAt: null,
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second Todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            var userOne = new User(users[0]).save();
            var userTwo = new User(users[1]).save();
            return Promise.all([userOne, userTwo]);
        })
        .then(() => done());
};


module.exports = { todos, populateTodos, users, populateUsers };