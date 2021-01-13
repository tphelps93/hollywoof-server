const TSService = require('../src/timestamps/timestamps-service');
const knex = require('knex');
const { expect } = require('chai');

describe('Timestamps service object', function () {
  let db;
  let testTimestamps = [
    {
      ts_id: 1,
      timestamp: '01:25:23',
      comment: 'Crazy Loud',
      volume: 'High',
      confirmations: 1,
      likes: 2,
      dislikes: 3,
      media_id: 'tt9397000',
      userid: 1,
      date_created: new Date(),
    },
    {
      ts_id: 2,
      timestamp: '02:25:23',
      comment: 'Loud',
      volume: 'Medium',
      confirmations: 2,
      likes: 3,
      dislikes: 4,
      media_id: 'tt9397111',
      userid: 1,
      date_created: new Date(),
    },
    {
      ts_id: 3,
      timestamp: '03:25:23',
      comment: 'Not too Loud',
      volume: 'Low',
      confirmations: 3,
      likes: 1,
      dislikes: 0,
      media_id: 'tt9397222',
      userid: 1,
      date_created: new Date(),
    },
  ];

  let testUsers = [
    {
      user_id: 1,
      name: 'Bob Blue',
      user_name: 'bblue',
      password: '$2a$12$rbmLFCNIs3w/jntWJp7T5OaCcD6M4APSCMshfQOczq8Fi3o4A4W46',
    },
  ];

  before('setup db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
  });

  before('clean db', () =>
    db.raw('TRUNCATE TABLE hw_timestamps, hw_users RESTART IDENTITY CASCADE')
  );

  beforeEach(() => {
    return db.into('hw_users').insert(testUsers);
  });
  afterEach('clean db', () =>
    db.raw('TRUNCATE TABLE hw_timestamps, hw_users RESTART IDENTITY CASCADE')
  );

  after('destroy db connection', () => db.destroy());

  context('Given "hw_timestamps" has data', () => {
    beforeEach(() => {
      return db.into('hw_timestamps').insert(testTimestamps);
    });

    it('getAllTS() resolves all timestamps from "hw_timestamps" table', () => {
      return TSService.getAllTS(db).then(actual => {
        expect(actual).to.eql(
          testTimestamps.map(timestamp => {
            return { ...timestamp, user_name: 'bblue' };
          })
        );
      });
    });

    it(`getById() resolves a timestamp by id from 'hw_timestamps' table`, () => {
      const thirdId = 3;
      const thirdTestTS = testTimestamps[thirdId - 1];
      return TSService.getById(db, thirdId).then(actual => {
        expect(actual).to.eql({
          ts_id: thirdId,
          timestamp: thirdTestTS.timestamp,
          comment: thirdTestTS.comment,
          volume: thirdTestTS.volume,
          confirmations: thirdTestTS.confirmations,
          likes: thirdTestTS.likes,
          dislikes: thirdTestTS.dislikes,
          media_id: thirdTestTS.media_id,
          userid: thirdTestTS.userid,
          date_created: thirdTestTS.date_created,
        });
      });
    });

    it(`deleteTS() removes a timestamp by id from 'hw_timestamps' table`, () => {
      const tsId = 3;
      return TSService.deleteTS(db, tsId)
        .then(() => TSService.getAllTS(db))
        .then(allTimestamps => {
          const expected = testTimestamps.filter(
            timestamp => timestamp.ts_id !== tsId
          );
          expect(allTimestamps).to.eql(
            expected.map(ts => {
              return { ...ts, user_name: 'bblue' };
            })
          );
        });
    });
    it(`updateTS() updates a timestamp from the 'hw_timestamps' table`, () => {
      const idOfTSToUpdate = 2;
      const newTSData = {
        timestamp: '02:25:23',
        comment: 'Loud',
        volume: 'Medium',
        confirmations: 2,
        likes: 3,
        dislikes: 4,
        media_id: 'tt9397111',
        userid: 1,
        date_created: new Date(),
      };
      return TSService.updateTS(db, idOfTSToUpdate, newTSData)
        .then(() => TSService.getById(db, idOfTSToUpdate))
        .then(timestamp => {
          expect(timestamp).to.eql({
            ts_id: idOfTSToUpdate,
            ...newTSData,
          });
        });
    });
  });

  context('Given "hw_timestamps" has no data', () => {
    it('getAllTS() resolves an empty array', () => {
      return TSService.getAllTS(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });
    it('insertTS() inserts a new timestamp and resolves the new timestamp with a "ts_id"', () => {
      this.retries(3);
      const newTS = {
        timestamp: '02:25:23',
        comment: 'Loud',
        volume: 'Medium',
        confirmations: 2,
        likes: 3,
        dislikes: 4,
        media_id: 'tt9397111',
        userid: 1,
        date_created: new Date(),
      };
      return TSService.insertTS(db, newTS).then(actual => {
        expect(res => {
          expect(res.body.timestamp).to.eql(newTS.timestamp);
          expect(res.body.comment).to.eql(newTS.comment);
          expect(res.body.volume).to.eql(newTS.volume);
          expect(res.body.confirmations).to.eql(newTS.confirmations);
          expect(res.body.likes).to.eql(newTS.likes);
          expect(res.body.dislikes).to.eql(newTS.dislikes);
          expect(res.body.media_id).to.eql(newTS.media_id);
          expect(res.body.userid).to.eql(newTS.userid);
          const expected = new Date().toLocaleString();
          const actual = new Date(res.body.date_created).toLocaleString();
          expect(actual).to.eql(expected);
        });
      });
    });
  });
});
