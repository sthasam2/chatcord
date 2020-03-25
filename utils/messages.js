const moment = require("moment");

//Formatting of a message(username, text, time)
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format("h:mm a")
    };
}

module.exports = formatMessage;
