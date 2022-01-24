const db = require("../../models");
const PriceHistory = db.priceHistory;

module.exports.getPrevious = async () => {
  try {
    return await PriceHistory.findOne().sort('-createdAt');
  } catch (err) {
    console.error(err);
  }
};
module.exports.create = async (data) => {
  try {
    await new PriceHistory(data).save();
  } catch (err) {
    console.error(err);
  }
};
