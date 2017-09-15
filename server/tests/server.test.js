const expect = require('expect');
const request = require('supertest');

const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todos');
const { User } = require('../models/users');
const { todos, populateTodos, users, populateUsers } = require('./sead/sead');



beforeEach(populateUsers);
beforeEach(populateTodos);


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

describe('GET /users/me', () => {
    it('shold return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not auth', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});


describe('POST /users', () => {
    it('should create a user', (done) => {
        let email = 'mo@gmail.com';
        let password = '231514';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findOne({ email })
                    .then((user) => {
                        expect(user.email).toBe(email);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });

    it('it should return validation errors if request invalid', (done) => {
        let email = 'mohamed.com';
        let password = 'hgsa;kgh';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .expect((res) => expect(res.headers['x-auth']).toNotExist())
            .end(done);
    });

    it('should return error on signing with exist email', (done) => {
        let email = 'mohElsonny@gmail.com';
        let password = 'userPassword';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .expect((res) => expect(res.headers['x-auth']).toNotExist())
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.find({ email })
                    .then((users) => {
                        expect(users.length).toBe(1);
                        done();
                    }).catch((e) => done(e));

            });
    });

});


describe('POST /users/login', () => {
    it('should login user and return with token', (done) => {
        let email = users[1].email;
        let password = users[1].password;

        request(app)
            .post('/users/login')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body.email).toBe(email);
                expect(res.body._id).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findOne({ email })
                    .then((user) => {
                        expect(user.tokens[0]).toInclude({
                            access: 'auth',
                            token: res.headers['x-auth']
                        });
                        done();
                    })
                    .catch(e => done(e));
            });
    });

    it('should return error on signing with not exist email', (done) => {
        let email = 'moElsonny@example.com';
        let password = 'new password';

        request(app)
            .post('/users/login')
            .send({ email, password })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end(done);
    });

    it('should return error on signing with invalid password', (done) => {
        let email = users[1].email;
        let password = 'invalid password';

        request(app)
            .post('/users/login')
            .send({ email, password })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findOne({ email })
                    .then(user => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    })
                    .catch(e => done(e));
            });
    });
});