const supertest = require('supertest');
const app = require('../app');
const agent = supertest.agent(app);
const User = require('../models/User');
const mongoose = require('mongoose');
const database = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

beforeAll(async () => {
    await mongoose.connect(database, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    await User.findOneAndRemove({ username: 'test' });
})

describe('API TESTING', () => {
    test('Failed in getting Users List without Login', async function () {
        await agent.get('/api/v1/users/all')
            .expect(401);
    });

    test('Signup User', async () => {
        await agent.post('/api/v1/users/register')
            .send({
                username: 'test',
                email: 'test@gmail.com',
                password: '1314124',
                type: 2
            })
            .expect(200);
    });

    test('Get Auth Token After login', async () => {
        await agent.post('/api/v1/users/login')
            .send({
                username: 'test0',
                password: 'test0000'
            })
            .expect(200)
            .then(response => {
                expect(response.body.token).toContain('Bearer ');
            })
    });
});