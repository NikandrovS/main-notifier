const { messageGenerator } = require("../helpers");
const { TOKENS } = require("./utils/constants");
const history = require("./methods/history");
const ticket = require("./methods/tickets");
const axios = require("axios");

var CronJob = require("cron").CronJob;
var job = new CronJob("0 */5 * * * *", function () {
  const now = new Date();
  console.log(now.toTimeString());
  getPrice();
});
job.start();

const getPrice = async () => {
  //- get price
  const response = await axios({
    method: "post",
    url: "https://api.dex.guru/v2/tokens/price",
    headers: { "content-type": "text/html; charset=utf-8" },
    data: { ids: [`${process.env.TOKEN_ADDRESS}-${process.env.TOKEN_CHAIN}`] },
  });
  //- set token name from constant
  response.data.data.map(
    (token) => (token.name = TOKENS[token.address] || null)
  );

  for (const address of response.data.data) {
    //- check for same record
    const previous = await history.getPrevious();
    
    if (!previous) return await history.create(address);

    const sameUsdPrice = previous.token_price_usd === address.token_price_usd;
    const sameEthPrice = previous.token_price_eth === address.token_price_eth;

    if (sameUsdPrice && sameEthPrice) return;

    await history.create(address);
    
    //- search for matching tickets
    const multiplier = process.env.COUNT_COIN_BY || 1;
    const values = [
      previous.token_price_usd * multiplier,
      address.token_price_usd * multiplier,
    ].sort();

    const range = {
      from: values[0],
      to: values[1],
    };

    const result = await ticket.findRange(range);

    if (!result.length) return;
    //- prepare tickets for notify
    const sortedResult = result.reduce((acc, ticket) => {
      const valueIndex = acc.findIndex((t) => t.user_id === ticket.user_id);

      if (valueIndex === -1) {
        const data = {
          user_id: ticket.user_id,
          tickets: [ticket.price],
        };
        return [...acc, data];
      }

      const isExists = acc[valueIndex].tickets.includes(ticket.price);

      if (!isExists) acc[valueIndex].tickets.push(ticket.price);

      return acc;
    }, []);

    //- send notification for each user touched
    for (const value of sortedResult) {
      const text =
        messageGenerator(value.tickets) +
        "\nТекущая цена: " +
        (address.token_price_usd * multiplier).toFixed(2);
      await axios.get(
        `https://api.telegram.org/bot${
          process.env.BOT_TOKEN
        }/sendMessage?chat_id=${value.user_id}&text=${encodeURIComponent(text)}`
      );
    }

    //- change status for touched tickets
    const doneTickets = result.map((ticket) => ticket._id);

    for (const ticketId of doneTickets) {
      await ticket.setDone(ticketId);
    }
  }
};
