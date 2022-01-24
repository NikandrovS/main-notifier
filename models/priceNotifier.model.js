module.exports = (mongoose) => {
  const PriceNotifier = mongoose.model(
    "price_notifier",
    mongoose.Schema(
      {
        user_id: { type: Number, required: true },
        username: { type: String, required: true },
        price: { type: Number, required: true },
        status: { type: Boolean, default: false },
      },
      { timestamps: true }
    )
  );

  return PriceNotifier;
};
