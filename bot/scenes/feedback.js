const { Scenes } = require("telegraf");
const cancel_keyboard = require("../keyboards/cancel.keyboard");

const feedbackScene = new Scenes.BaseScene("feedbackScene");

feedbackScene.enter(async (ctx) => {
  const { message_id } = await ctx.reply(
    "Здесь вы можете оставить свой отзыв о работе бота или предложить идею для разработки новых возможностей. Просто напишите свое сообщение:",
    cancel_keyboard
  );
  ctx.scene.state.welcomeMessage = message_id;
});

feedbackScene.on("text", (ctx) => {
  ctx.telegram.sendMessage(process.env.ADMIN_ID, `Новой фидбек от @${ctx.message.from.username}\nТекст: ${ctx.message.text}`);
  ctx.reply( "Ваше сообщение доставлено. Спасибо что помогаете становиться лучше!" );

  return ctx.scene.leave();
});

feedbackScene.action("cancel", (ctx) => ctx.scene.leave());
feedbackScene.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage));

module.exports = feedbackScene;
