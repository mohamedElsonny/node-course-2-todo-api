// const MongoClint = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');


MongoClint.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: true
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('Unable to insert todo.', err);
    //     }
    //     console.log(JSON.stringify(res.ops, undefined, 2));

    // });

    // db.collection('Users').insertOne({
    //     name: 'Mohamed Gamal',
    //     age: 23,
    //     location: 'Egypt'
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('Unable to insert todo ', err);
    //     }
    //     console.log(JSON.stringify(res.ops, undefined, 2));
    // });

    db.close();
});