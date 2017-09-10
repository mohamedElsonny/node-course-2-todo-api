const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log('Unable to connect to MongoDB server', err);
    }

    console.log('Connected to MongoDb Server');

    // delete many
    // db.collection('Todos').deleteMany({ text: 'Eat launch' }).then((res) => {
    //     console.log(res);
    // });

    // delete one
    // db.collection('Todos').deleteOne({ text: 'Eat lunch' }).then(res => {
    //     console.log(res);
    // });

    // find and delete
    // db.collection('Todos').findOneAndDelete({ completed: false }).then((res) => {
    //     console.log(res);
    // });

    // db.collection('Users').findOneAndDelete({ _id: new ObjectID('59b4da36b715da17d8b0c51b') })
    //     .then((res) => {
    //         console.log(res);
    //     }).catch((err) => {
    //         console.log('Unable to Delete the document');
    //     });


    db.collection('Users').deleteMany({ age: 23 }).then((res) => {
        console.log(res);
    });




});