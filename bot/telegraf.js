const { Telegraf, session, Scenes: { Stage } } = require('telegraf');
const newUsdNotify = require('./scenes/newUsdNotify')
const viewTickets = require('./scenes/viewTickets')

const stage = new Stage([newUsdNotify, viewTickets]); 

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session(), stage.middleware());

bot.command('/start', ctx => ctx.reply('Добро пожаловать'));
bot.command('/new', ctx => ctx.scene.enter('newTicketScene'));
bot.command('/view', ctx => ctx.scene.enter('viewTicketsScene'));

bot.launch();
