const { Markup } = require("telegraf");

const keyboard = (id) => Markup.inlineKeyboard([Markup.button.callback("Удалить", "delete:" + id)]);

module.exports = keyboard;
