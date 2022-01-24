module.exports = (mongoose) => {
  const PriceHistory = mongoose.model(
    "price_history",
    mongoose.Schema(
      {
        address: { type: String, required: true },
        token_price_usd: { type: Number, required: true },
        token_price_eth: { type: Number, required: true },
        name: { type: String },
      },
      { timestamps: true }
    )
  );

  return PriceHistory;
};
