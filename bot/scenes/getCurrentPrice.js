const { Scenes } = require("telegraf");
const history = require("../methods/history");

const currentPriceScene = new Scenes.BaseScene("currentPriceScene");

currentPriceScene.enter(async (ctx) => {
  try {
    const lastRequest = await history.getPrevious();
    const currentPrice = (lastRequest.token_price_usd * (process.env.COUNT_COIN_BY || 1)).toFixed(2);

    await ctx.reply(`Текущая цена: ${currentPrice}$ за ${process.env.COUNT_COIN_BY} токенов`);
  } catch (error) {
    console.log(error);
    return ctx.scene.leave();
  }
});

module.exports = currentPriceScene;
