var client = require("redis").createClient();

client.psubscribe("access log:*");
client.on("pmessage", function (sub, channel, message) {
    console.log(channel + ": " + message.toString());
});
