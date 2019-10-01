var express = require("express");
var nodemon = require("nodemon");
var app = express();
var path = require("path");
var cors = require("cors");

var fs = require("fs");

const formidable = require("formidable");
var http = require("http").Server(app);
const PORT = 3000;

// SOCKET.IO
var io = require("socket.io")(http);
var sockets = require("./socket.js");
//----------------------
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());

// Image Upload
app.use(express.static(path.join(__dirname, "../dist/assignment1angular")));
app.use("/images", express.static(path.join(__dirname, "./userimages")));
// Image Upload
// ------------------------------

// var admin_user = {
//   email: "a-user@mail.com",
//   username: "Super Admin A",
//   password: "123a",
//   isSuperAdmin: true,
//   isGroupAdmin: true,
//   valid: ""
// };

// var valid_user = { valid_user_list: [] };
// valid_user.valid_user_list.push(admin_user);
// var userJSON = JSON.stringify(valid_user);

// var groups = { group_list: [] };

// listen.js
const listen = require("../server/routes/listen.js");
listen.listen(http, PORT);

// MongoDB
const MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
const url = "mongodb://localhost:27017";
MongoClient.connect(
  url,
  { poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true },
  function(err, client) {
    if (err) {
      return console.log(err);
    }

    const db = client.db("assignment1database");
    var groupCollection = db.collection("groups");
    // const usercollectionserver = client.collection("users");
    // usercollectionserver
    //   .find({ email: "a-user@mail.com" })
    //   .count((err, data) => {
    //     if (count == 0) {
    //       usercollectionserver.insertOne(admin_user, (err, dbres) => {
    //         if (err) throw err;
    //         console.log(dbres.insertCount);
    //       });
    //     }
    //   });
    require("./routes/auth-routes.js")(db, app, formidable);
    require("./routes/group-routes.js")(db, app, ObjectID);
    sockets.connect(io, PORT, db);
  }
);
// routes
// require("./routes/auth-routes.js")(app, path);
// require("./routes/group-routes.js")(app, path);
