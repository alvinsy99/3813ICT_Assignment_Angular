var express = require("express");
var nodemon = require("nodemon");
var app = express();
var path = require("path");
var cors = require("cors");
app.use(cors());

var http = require("http").Server(app);
const PORT = 3000;

var bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../dist/assignment1angular")));

var valid_user = [
  {
    email: "a-user@mail.com",
    password: "123a",
    type: 0,
    valid: ""
  },
  {
    email: "b-user@mail.com",
    password: "123b",
    type: 1,
    valid: ""
  },
  {
    email: "c-user@mail.com",
    password: "123c",
    type: 2,
    valid: ""
  },
  {
    email: "d-user@mail.com",
    password: "123d",
    type: 2,
    valid: ""
  }
];

exports.valid_user = valid_user;
// listen.js
const listen = require("../server/routes/listen.js");
listen.listen(http, PORT);

// routes
require("./routes/auth-routes.js")(app, path);
require("./routes/group-routes.js")(app, path);
