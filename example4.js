// 192.168.16.13
var http = require("http"),
    client = require("redis").createClient();

function copy_stats(reply) {
    var ret = {};

    Object.keys(reply).forEach(function (key) {
        ret[key] = reply[key].toString();
    });

    return ret;
}

function handle_client(port, request, response) {
    var footer, slide_list, request_count, start = Date.now(), stats = {};

    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    
    client.mget("page_header.html", "page_footer.html", function (err, reply) {
        response.write(reply[0]); // header
        footer = reply[1].toString();
    });
    
    client.hincrby("port", port, 1);
    client.hincrby("url", request.url, 1);
    client.hincrby("ip", request.connection.remoteAddress, 1);

    client.hgetall("port", function (err, reply) {
        stats.port = copy_stats(reply);
    });
    client.hgetall("url", function (err, reply) {
        stats.url = copy_stats(reply);
    });
    client.hgetall("ip", function (err, reply) {
        stats.ip = copy_stats(reply);
        
        response.write(JSON.stringify(stats));
        response.write(footer);
        response.end();
        
        client.publish("access log:" + port, request.connection.remoteAddress + " " +
            request.url + " " + (request.headers["user-agent"] || ""));
    });
}

function get_handler(port) {
    return function (request, response) {
        handle_client(port, request, response);
    }
}

for (var port = 9000; port <= 9999; port += 1) {
    console.log("Listening on " + port);
    http.createServer(get_handler(port)).listen(port);
}
