// Dependency Imports
const express = require('express');
const path = require('path');
const logger = require('../logger');

// Service Imports
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

const serializeUser = user => ({
  user_id: user.user_id,
  name: user.name,
  user_name: user.user_name,
  password: user.password,
});

usersRouter
  .route('/')
  .get(jsonBodyParser, (req, res, next) => {
    UsersService.getAllUsers(req.app.get('db'))
      .then(users => {
        res.json(users.map(serializeUser));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { name, user_name, password } = req.body;
    for (const field of ['name', 'user_name', 'password']) {
      if (!req.body[field]) {
        // logger.error(`${field} is required.`);
        return res.status(400).send({
          error: { message: `'${field} is required.` },
        });
      }
    }

    const passwordError = UsersService.validatePassword(password);

    if (passwordError) return res.status(400).json({ error: passwordError });

    UsersService.hasUserWithUserName(req.app.get('db'), user_name)
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: 'Username already taken' });

        return UsersService.hashedPassword(password).then(hashedPassword => {
          const newUser = {
            name,
            user_name,
            password: hashedPassword,
          };

          return UsersService.insertUser(req.app.get('db'), newUser).then(
            user => {
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.user_id}`))
                .json(serializeUser(user));
            }
          );
        });
      })
      .catch(next);
  });

usersRouter
  .route('/:user_id')
  .all((req, res, next) => {
    const { user_id } = req.params;

    UsersService.getById(req.app.get('db'), user_id)
      .then(user => {
        if (!user) {
          logger.error(`User with id ${user_id} not found.`);
          return res.status(404).json({
            error: { message: `User Not Found` },
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeUser(res.user));
  })

  .delete((req, res, next) => {
    const { user_id } = req.params;
    UsersService.deleteUser(req.app.get('db'), user_id)
      .then(numRowsAffected => {
        logger.info(`User with id ${user_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = usersRouter;
