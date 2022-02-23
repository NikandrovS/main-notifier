const { Markup } = require("telegraf");

const keyboard = Markup.inlineKeyboard([
  Markup.button.url("Открыть график", process.env.CHART_LINK),
]);

module.exports = keyboard;
