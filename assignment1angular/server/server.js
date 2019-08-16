var express = require("express");
var app = express();
var path = require("path");
var cors = require("cors");
app.use(cors());

var http = require("http").Server(app);
const PORT = 3000;

var bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../dist/assignment1angular")));

// listen.js
const listen = require("../server/routes/listen.js");
listen.listen(http, PORT);

// authentication
require("./routes/auth-routes.js")(app, path);
