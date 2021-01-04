const TSService = {
  getAllTS(db) {
    return db.select('*').from('hw_timestamps');
  },
  insertTS(db, newTS) {
    return db
      .insert(newTS)
      .into('hw_timestamps')
      .returning('*')
      .then(([ts]) => ts);
  },
  getById(db, ts_id) {
    return db.from('hw_timestamps').select('*').where('ts_id', ts_id).first();
  },
  deleteTS(db, ts_id) {
    return db('hw_timestamps').where({ ts_id }).delete();
  },
  updateTS(db, ts_id, newTSFields) {
    return db('hw_timestamps').where({ ts_id }).update(newTSFields);
  },
};

module.exports = TSService;
