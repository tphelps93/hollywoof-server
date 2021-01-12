const express = require('express');
const path = require('path');
const logger = require('../logger');
const BarksService = require('./barks-service');
const { requireAuth } = require('../middleware/jwt-auth');

const barkRouter = express.Router();
const jsonBodyParser = express.json();

const serializeBark = bark => ({
  bark_id: bark.bark_id,
  barks: bark.barks,
  media_id: bark.media_id,
});

barkRouter
  .route('/')
  .get((req, res, next) => {
    BarksService.getAllBarks(req.app.get('db'))
      .then(barks => {
        res.json(barks.map(serializeBark));
      })
      .catch(next);
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { barks, media_id } = req.body;
    const newBark = {
      barks,
      media_id,
    };

    for (const field of ['barks', 'media_id']) {
      if (!newBark[field]) {
        logger.error(`'${field}' is required`);

        return res.status(400).send({
          error: { message: `'${field}' is required` },
        });
      }
    }

    return BarksService.insertBark(req.app.get('db'), newBark)
      .then(bark => {
        logger.info(`Bark with id ${bark.bark_id}`);

        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${bark.bark_id}`))
          .json(bark);
      })
      .catch(next);
  });

barkRouter
  .route('/:bark_id')
  .all((req, res, next) => {
    const { bark_id } = req.params;

    BarksService.getById(req.app.get('db'), bark_id)
      .then(bark => {
        if (!bark) {
          logger.error(`Bark with id ${bark_id} not found.`);
          return res.status(404).json({
            error: { message: 'Bark not found' },
          });
        }
        res.bark = bark;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeBark(res.bark));
  })
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const { bark_id, barks, media_id } = req.body;

    const barkToUpdate = {
      bark_id,
      barks,
      media_id,
    };

    const numOfValues = Object.values(barkToUpdate).filter(Boolean).length;

    if (numOfValues === 0) {
      logger.error('Invalid update without required fields');
      return res.status(400).json({
        error: {
          message:
            'Request body must contain either "bark_id", "barks", "media_id"',
        },
      });
    }

    BarksService.updateBark(req.app.get('db'), req.params.bark_id, barkToUpdate)
      .then(numRowsAffected => {
        return res.status(204).end();
      })
      .catch(next);
  });

module.exports = barkRouter;
