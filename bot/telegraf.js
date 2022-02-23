const { Telegraf, session, Scenes: { Stage } } = require('telegraf');
const getCurrentPrice = require('./scenes/getCurrentPrice')
const newUsdNotify = require('./scenes/newUsdNotify')
const viewTickets = require('./scenes/viewTickets')
const feedback = require('./scenes/feedback')

const stage = new Stage([newUsdNotify, viewTickets, getCurrentPrice, feedback]); 

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session(), stage.middleware());

bot.command('/start', ctx => ctx.reply('Добро пожаловать'));
bot.command('/new', ctx => ctx.scene.enter('newTicketScene'));
bot.command('/view', ctx => ctx.scene.enter('viewTicketsScene'));
bot.command('/price', ctx => ctx.scene.enter('currentPriceScene'));
bot.command('/feedback', ctx => ctx.scene.enter('feedbackScene'));

bot.launch();
