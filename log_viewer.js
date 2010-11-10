var client = require("redis").createClient();

client.subscribe("access log:8000");
client.on("message", function (channel, message) {
    console.log(message.toString());
});
