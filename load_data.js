var client = require("redis").createClient(),
    fs = require("fs");
    
fs.readFile("page_header.html", function (err, data) {
    client.set("page_header.html", data);
});

fs.readFile("page_footer.html", function (err, data) {
    client.set("page_footer.html", data, function (err, reply) {
        client.quit();
    });
});
