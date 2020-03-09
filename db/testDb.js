const CONFIG = require('../config');
const MongoDB = require('../modules/MongoDB');
module.exports = new MongoDB(CONFIG.DB_URL, 'CRUDRouter');