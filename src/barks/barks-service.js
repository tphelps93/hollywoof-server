const BarksService = {
  getAllBarks(db) {
    return db.select('*').from('hw_barks');
  },
  insertBark(db, newTS) {
    return db
      .insert(newTS)
      .into('hw_barks')
      .returning('*')
      .then(([ts]) => ts);
  },

  updateBark(db, bark_id, newBarkFields) {
    return db('hw_barks').where({ bark_id }).update(newBarkFields);
  },
};

module.exports = BarksService;
