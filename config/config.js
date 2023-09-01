const { mixin, db } = require('../config.json');

const DATABASE_CONFIG = db;

const CLIENT_CONFIG = mixin;

module.exports = { DATABASE_CONFIG, CLIENT_CONFIG };
