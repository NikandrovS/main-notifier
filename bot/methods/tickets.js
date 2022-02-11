const db = require("../../models");
const PriceNotifier = db.priceNotifier;

module.exports.create = async (data) => {
  try {
    await new PriceNotifier(data).save();
  } catch (err) {
    console.error(err);
  }
};

module.exports.getTicketByUserId = async (user_id) => {
  try {
    return await PriceNotifier.find(
      { user_id, status: false },
      {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      }
    ).sort({ price: -1 });
  } catch (err) {
    console.error(err);
  }
};

module.exports.findRange = async (range) => {
  try {
    return await PriceNotifier.find({
      price: {
        $gte: range.from,
        $lte: range.to,
      },
      status: false,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports.setDone = async (id) => {
  try {
    return await PriceNotifier.findByIdAndUpdate(id, { status: true });
  } catch (err) {
    console.error(err);
  }
};

module.exports.deleteById = async (id) => {
  try {
    return await PriceNotifier.findByIdAndRemove(id);
  } catch (err) {
    console.error(err);
  }
};
