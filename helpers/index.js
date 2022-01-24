const helpers = {};

helpers.messageGenerator = (tickets) => {
    let message = "";
    if (tickets.length === 1) {
      message += `Цена достигла: ${tickets[0]}$`;
    } else {
      message += "Сработали уведомления на: ";
      tickets.sort().forEach((price) => {
        message += `${price}$ `;
      });
    }
    return message;
  };

module.exports = helpers;
