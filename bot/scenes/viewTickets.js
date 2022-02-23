const { Scenes } = require("telegraf");
const ticket = require("../methods/tickets");

const cancel_keyboard = require("../keyboards/cancel.keyboard");
const delete_keyboard = require("../keyboards/deleteById.keyboard");

const viewTicketsScene = new Scenes.BaseScene("viewTicketsScene");

viewTicketsScene.enter(async (ctx) => {
  try {
    const { message_id } = await ctx.reply(
      "Просмотр добавленных уведомлений",
      cancel_keyboard
    );
    ctx.scene.state.welcomeMessage = message_id;

    const user_id = ctx.message ? ctx.message.from.id : ctx.scene.state.user_id;
    const tickets = await ticket.getTicketByUserId(user_id);
    ctx.scene.state.ticketMessageIds = [];

    for (const ticket of tickets) {
      const { message_id } = await ctx.reply(
        ticket.price + "$",
        delete_keyboard(ticket.id)
      );
      ctx.scene.state.ticketMessageIds.push(message_id);
    }

  } catch (err) {
    console.error(err);
    ctx.reply("Возникла ошибка");
  }
});

viewTicketsScene.action(/^delete:.*/, async (ctx) => {
  try {
    const id = ctx.callbackQuery.data.split(":")[1];
    const res = await ticket.deleteById(id);
    if (res.price) ctx.reply(`Увеодмление на цену: ${res.price}$ удалено`);

    const ticketList = ctx.scene.state.ticketMessageIds;
    await Promise.all(ticketList.map(async (id) => ctx.deleteMessage(id)));
    await ctx.deleteMessage(ctx.scene.state.welcomeMessage);

    ctx.scene.enter("viewTicketsScene", { user_id: ctx.callbackQuery.from.id });
  } catch (err) {
    console.error(err);
  }
});

viewTicketsScene.action("cancel", async (ctx) => {
  try {
    const ticketList = ctx.scene.state.ticketMessageIds;
    await Promise.all(ticketList.map(async (id) => ctx.deleteMessage(id)));

    ctx.deleteMessage(ctx.scene.state.welcomeMessage);

    ctx.scene.leave();
  } catch (error) {
    console.error(error);
  }
});

module.exports = viewTicketsScene;
