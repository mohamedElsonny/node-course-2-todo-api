// const MongoClint = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server');


    // db.collection('Todos').find({
    //     _id: new ObjectID('59b4d75876013902fc43ff44')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }).catch((err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    db.collection('Users').find({ age: 23 }).toArray().then((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }).catch((err) => console.log('Unable to fetch todos, ', err));


    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos Count: ${count}`);
    // }).catch((err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    // db.close();
});