var http = require("http"),
    client = require("redis").createClient(),
    port = 9000;

function stats(req) {
    client.hincrby("port", port, 1);
    client.hincrby("url", req.url, 1);
    client.hincrby("ip", req.connection.remoteAddress, 1);
    client.publish("access log:" + port, req.connection.remoteAddress + " " +
        req.url + " " + (req.headers["user-agent"] || ""));
}

http.createServer(function (request, response) {
    stats(request);

    client.rpush("message queue", request.url);
    response.writeHead(200, {
        "Content-Type": "text/plain"
    });
    response.end("Message " + request.url + " has been sent");
}).listen(9000);

http.createServer(function (request, response) {
    stats(request);

    console.log("blpopping");
    client.blpop("message queue", 0, function (err, reply) {
        console.log("got blpop response " + reply[1]);
        response.writeHead(200, {
            "Content-Type": "text/plain"
        });

        response.end("Message " + reply[1] + " has been received");
    });
}).listen(9001);
