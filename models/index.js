const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.priceNotifier = require("./priceNotifier.model")(mongoose);
db.priceHistory = require("./priceHistory.model")(mongoose);

module.exports = db;
