import { Database } from "../config/database";

const request = require('supertest');

describe('GET /hello', () => {
  Database.config()
  it('responds with json', (done) => {
    const supertest = request('http://localhost:4000');
    supertest
      .post('/graphql')
      .send({ query: '{ helloWorld }' })
      .set('Accept', 'application/json')
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any) => {
        if (err) console.log(err.message);
      });
    done();
  });
});
