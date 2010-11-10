var http = require("http"),
    client = require("redis").createClient();

http.createServer(function (request, response) {
    var footer, slide_list, request_count, start = Date.now();

    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    
    client.mget("page_header.html", "page_footer.html", function (err, reply) {
        response.write(reply[0]); // header
        footer = reply[1].toString();
    });
    
    client.hincrby("ip", request.connection.remoteAddress, 1);
    client.hgetall("ip", function (err, reply) {
        var data = {
            ip: {}
        };
        Object.keys(reply).forEach(function (ip) {
            data.ip[ip] = reply[ip].toString();
        });
        
        response.write(JSON.stringify(data));
        response.write(footer);
        response.end();
        client.publish("access log:9000", request.connection.remoteAddress + " " +
            request.url + " " + (request.headers["user-agent"] || ""));
    });
}).listen(9000);