const UsersService = require('../src/users/users-service');
const knex = require('knex');
const { expect } = require('chai');

describe('Users service object', function () {
  let db;
  let testUsers = [
    {
      user_id: 1,
      name: 'Karen Connely',
      user_name: 'kconnely',
      password: 'mybirthday',
      date_created: new Date(),
    },
    {
      user_id: 2,
      name: 'Sharon Sumpter',
      user_name: 'sumpter',
      password: 'mypassword',
      date_created: new Date(),
    },
    {
      user_id: 3,
      name: 'Sarah Phelps',
      user_name: 'sd188',
      password: 'passwordz',
      date_created: new Date(),
    },
  ];

  before('setup db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
  });

  before('clean db', () =>
    db.raw('TRUNCATE TABLE hw_users RESTART IDENTITY CASCADE')
  );
  afterEach('clean db', () =>
    db.raw('TRUNCATE TABLE hw_users RESTART IDENTITY CASCADE')
  );

  after('destroy db connection', () => db.destroy());

  context('Given "hw_users" has data', () => {
    beforeEach(() => {
      return db.into('hw_users').insert(testUsers);
    });

    it('getAllUsers() resolves all users from "hw_users" table', () => {
      return UsersService.getAllUsers(db).then(actual => {
        expect(actual).to.eql(testUsers);
      });
    });
  });

  context('Given "hw_users" has no data', () => {
    it('getAllUsers() resolves an empty array', () => {
      return UsersService.getAllUsers(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });
    it('insertUser() inserts a new user and resolves the new user with a "user_id"', () => {
      this.retries(3);
      const newUser = {
        name: 'Test Name',
        user_name: 'testUserName',
        password: 'testpass',
        date_created: new Date(),
      };
      return UsersService.insertUser(db, newUser).then(actual => {
        expect(res => {
          expect(res.body.name).to.eql(newUser.name);
          expect(res.body.user_name).to.eql(newUser.user_name);
          expect(res.body.password).to.eql(newUser.password);
          const expected = new Date().toLocaleString();
          const actual = new Date(res.body.date_created).toLocaleString();
          expect(actual).to.eql(expected);
          expect(res.body.isadmin).to.eql(newUser.isadmin);
        });
      });
    });
  });
});