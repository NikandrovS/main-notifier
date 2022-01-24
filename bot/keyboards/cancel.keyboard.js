const { Markup } = require('telegraf');

const keyboard = Markup.inlineKeyboard([Markup.button.callback("Отмена", "cancel")]);

module.exports = keyboard;
