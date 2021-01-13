const BarksService = require('../src/barks/barks-service');
const knex = require('knex');
const { expect } = require('chai');

describe('Barks service object', function () {
  let db;
  let testBarks = [
    {
      bark_id: 1,
      barks: 'Yes',
      media_id: 'tt9397222',
      date_created: new Date(),
    },
    {
      bark_id: 2,
      barks: 'No',
      media_id: 'tt9397111',
      date_created: new Date(),
    },
    {
      bark_id: 3,
      barks: 'Yes',
      media_id: 'tt9397333',
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
    db.raw('TRUNCATE TABLE hw_barks RESTART IDENTITY CASCADE')
  );
  afterEach('clean db', () =>
    db.raw('TRUNCATE TABLE hw_barks RESTART IDENTITY CASCADE')
  );

  after('destroy db connection', () => db.destroy());

  context('Given "hw_barks" has data', () => {
    beforeEach(() => {
      return db.into('hw_barks').insert(testBarks);
    });

    it('getAllBarks() resolves all barks from "hw_barks" table', () => {
      return BarksService.getAllBarks(db).then(actual => {
        expect(actual).to.eql(testBarks);
      });
    });

    it(`getById() resolves a bark by id from 'hw_barks' table`, () => {
      const thirdId = 3;
      const thirdTestBark = testBarks[thirdId - 1];
      return BarksService.getById(db, thirdId).then(actual => {
        expect(actual).to.eql({
          bark_id: thirdId,
          barks: thirdTestBark.barks,
          media_id: thirdTestBark.media_id,
          date_created: thirdTestBark.date_created,
        });
      });
    });

    it(`updateBark() updates a bark from the 'hw_barks' table`, () => {
      const idOfBarkToUpdate = 2;
      const newBarkData = {
        barks: "Yes",
        media_id: "tt9397000",
        date_created: new Date(),
      };
      return BarksService.updateBark(
        db,
        idOfBarkToUpdate,
        newBarkData
      )
        .then(() => BarksService.getById(db, idOfBarkToUpdate))
        .then(bark => {
          expect(bark).to.eql({
            bark_id: idOfBarkToUpdate,
            ...newBarkData,
          });
        });
    });
  });

  context('Given "hw_barks" has no data', () => {
    it('getAllBarks() resolves an empty array', () => {
      return BarksService.getAllBarks(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });
    it('insertBark() inserts a new bark and resolves the new bark with a "bark_id"', () => {
      this.retries(3);
      const newBark = {
        barks: "No",
        media_id: "tt9397888",
        date_created: new Date(),
      };
      return BarksService.insertBark(db, newBark).then(actual => {
        expect(res => {
          expect(res.body.barks).to.eql(newBark.barks);
          expect(res.body.media_id).to.eql(newBark.media_id);
          const expected = new Date().toLocaleString();
          const actual = newDate(res.body.date_created).toLocaleString();
          expect(actual).to.eql(expected);
        });
      });
    });
  });
});
