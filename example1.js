var client = require("redis").createClient();

client.lrange("slides", 0, -1, function (err, reply) {
    reply.forEach(function (slide, num) {
        console.log("slide:" + num + " " + slide);
    });
});

client.incr("requests", function (err, reply) {
    console.log("request count: " + reply);
});
