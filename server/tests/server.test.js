const expect = require('expect');
const request = require('supertest');

const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todos');


const todos = [{
    _id: new ObjectID(),
    text: 'First Todo',
    completed: false,
    completedAt: null
}, {
    _id: new ObjectID(),
    text: 'Second Todo',
    completed: true,
    completedAt: 333
}];


beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});


describe('Post /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            });
    });

    it('shouldn\'t create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2); // 2 is the defualt number of to do in BeforeEach
                    done();
                }).catch((err) => done(err));
            });
    });
});

describe('GET /todos', () => {
    it('should return all the todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});


describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        let id = new ObjectID();
        request(app)
            .get(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non object ids', (done) => {
        let id = 123;
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});


describe('DELETE /todos/:id', () => {

    it('should delete todo by id and return the todo', (done) => {
        let hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId)
                    .then((res) => {
                        expect(res).toNotExist();
                        done();
                    }).catch(err => done(err));
            });
    });

    it('should return 404 if todo not found', (done) => {
        let hexId = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id is not valid', (done) => {
        let hexId = '123';

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

});

describe('PATCH /todos/:id', () => {


    it('should return updated todo if sent a valid id', (done) => {
        let id = todos[0]._id.toHexString();
        let completed = true;
        let text = 'Updated text';

        request(app)
            .patch(`/todos/${id}`)
            .send({ completed, text })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(id)
                    .then((todo) => {
                        if (!todo) {
                            return done(err);
                        }
                        expect(todo.text).toBe(text);
                        expect(todo.completed).toBe(true);
                        expect(todo.completedAt).toBeA('number');
                        done();
                    }).catch((err) => done(err));
            });
    });

    it('should clear completedAt when todo is not completed', (done) => {
        let completed = false;
        let id = todos[1]._id.toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .send(completed)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(id)
                    .then((todo) => {
                        if (!todo) {
                            return done(err);
                        }
                        expect(todo.completed).toBe(false);
                        expect(todo.completedAt).toNotExist();
                        done();
                    }).catch(err => done(err));
            });

    });
});