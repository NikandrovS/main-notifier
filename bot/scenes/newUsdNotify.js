const { Scenes } = require("telegraf");
const cancel_keyboard = require("../keyboards/cancel.keyboard");

const ticket = require("../methods/tickets");
const history = require("../methods/history");

const newTicketScene = new Scenes.BaseScene("newTicketScene");

newTicketScene.enter(async (ctx) => {
  try {
    const createdTickets = await ticket.getTicketByUserId(ctx.message.from.id);
    const maxAllowedTickets = process.env.MAX_TICKET_COUNT;

    const lastRequest = await history.getPrevious();
    const currentPrice = (lastRequest.token_price_usd * (process.env.COUNT_COIN_BY || 1)).toFixed(2);
    if (createdTickets.length >= maxAllowedTickets) {
      ctx.reply(
        `Максимальное количество заявок: ${maxAllowedTickets}.\nВы можете удалить одно из ранее созданных напоминаний с помощью команды /view`
      );
      return ctx.scene.leave();
    } else {
      const { message_id } = await ctx.reply(
        `Введите цену по достижению которой вы получите уведомление\nТекущая цена: ${currentPrice}$ за ${process.env.COUNT_COIN_BY} токенов`,
        cancel_keyboard
      );
      ctx.scene.state.welcomeMessage = message_id;
    }
  } catch (error) {
    console.log(error);
  }
});

newTicketScene.on("text", async (ctx) => {
  const price = Number(ctx.message.text.replace(",", "."));
  if (isNaN(price)) return ctx.reply("Введите число через запятую");

  try {
    const obj = {
      user_id: ctx.message.from.id,
      username: ctx.message.from.username,
      price,
    };

    await ticket.create(obj);

    ctx.reply(`Уведомление на цену: ${price}$ добавлено!`);
  } catch (err) {
    console.error(err);
    ctx.reply(`Уведомление не добавлено, возникла ошибка!`);
  }

  return ctx.scene.leave();
});

newTicketScene.action("cancel", (ctx) => ctx.scene.leave());
newTicketScene.leave(ctx => ctx.deleteMessage(ctx.scene.state.welcomeMessage))

module.exports = newTicketScene;
