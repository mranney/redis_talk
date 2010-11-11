var client = require("redis").createClient();

client.subscribe("access log:9000");
client.on("message", function (channel, message) {
    console.log(message.toString());
});
