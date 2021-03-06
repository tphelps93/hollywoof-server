const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]/;
const bcrypt = require('bcryptjs');

const UsersService = {
  // possibly remove(testing only)
  getAllUsers(db) {
    return db.select('*').from('hw_users');
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('hw_users')
      .returning('*')
      .then(([user]) => user);
  },
  getById(db, user_id) {
    return db.from('hw_users').select('*').where('user_id', user_id).first();
  },
  deleteUser(db, user_id) {
    return db('hw_users').where({ user_id }).delete();
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters';
    }
    if (password.length > 20) {
      return 'Password must be less than 20 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character';
    }
    return null;
  },
  hasUserWithUserName(db, user_name) {
    return db('hw_users')
      .where({ user_name })
      .first()
      .then(user => !!user);
  },
  hashedPassword(password) {
    return bcrypt.hash(password, 12);
  },
};

module.exports = UsersService;
