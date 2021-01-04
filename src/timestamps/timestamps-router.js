const express = require('express');
const path = require('path');
const TSService = require('./timestamps-service');
const { requireAuth } = require('../middleware/jwt-auth');

const tsRouter = express.Router();
const jsonBodyParser = express.json();

const serializeTimestamp = timestamp => ({
  ts_id: timestamp.ts_id,
  timestamp: timestamp.timestamp,
  comment: timestamp.comment,
  volume: timestamp.volume,
  media_id: timestamp.media_id,
  userid: timestamp.userid,
  date_created: timestamp.date_created,
});

tsRouter
  .route('/')
  .get((req, res, next) => {
    TSService.getAllTS(req.app.get('db'))
      .then(timestamps => {
        res.json(timestamps.map(serializeTimestamp));
      })
      .catch(next);
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { ts_id, timestamp, comment, volume, media_id, userid } = req.body;
    const newTS = {
      timestamp,
      comment,
      volume,
      media_id,
      userid,
    };

    for (const field of ['timestamp', 'comment', 'volume', 'media_id']) {
      if (!newTS[field]) {
        return res.status(400).send({
          error: { message: `'${field}' is required` },
        });
      }
    }

    newTS.userid = req.user.user_id;

    return TSService.insertTS(req.app.get('db'), newTS)
      .then(timestamp => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${timestamp.ts_id}`))
          .json(timestamp);
      })
      .catch(next);
  });

tsRouter
  .route('/:ts_id')
  .all((req, res, next) => {
    const { ts_id } = req.params;

    TSService.getById(req.app.get('db'), ts_id)
      .then(timestamp => {
        if (!timestamp) {
          return res.status(404).json({
            error: { message: 'Timestamp not found' },
          });
        }
        res.timestamp = timestamp;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeTimestamp(res.timestamp));
  })
  .delete(requireAuth, (req, res, next) => {
    const { ts_id } = req.params;
    TSService.deleteTS(req.app.get('db'), ts_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const { timestamp, comment, volume } = req.body;

    const timestampToUpdate = { timestamp, comment, volume };

    const numOfValues = Object.values(timestampToUpdate).filter(Boolean).length;

    if (numOfValues === 0) {
      return res.status(400).json({
        error: {
          message:
            'Request body must contain either "timestamp", "comment", "volume"',
        },
      });
    }

    TSService.updateTS(req.app.get('db'), req.params.ts_id, timestampToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = tsRouter;
