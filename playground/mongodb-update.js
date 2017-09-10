const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        console.log('Unable to connect to MongoDB Server');
    }

    console.log('Successifully Connected with MongoDB server');


    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('59b55491aa2b683525338e21')
    // }, {
    //     $set: {
    //         completed: false
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((res) => {
    //     console.log(JSON.stringify(res, undefined, 2));
    // }, (err) => {
    //     console.log(err);
    // });

    db.collection('Users').findOneAndUpdate({
        name: 'Gamal Abdelraziq'
    }, {
        $set: {
            name: 'Mohamed Gamal'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    }, (err) => {
        console.log(err);
    });





});