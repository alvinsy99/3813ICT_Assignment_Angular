var express = require("express");
var nodemon = require("nodemon");
var app = express();
var path = require("path");
var cors = require("cors");
var fs = require("fs");
app.use(cors());

var http = require("http").Server(app);
const PORT = 3000;

var bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../dist/assignment1angular")));

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

// users array
// fs.writeFile("users.json", userJSON, "utf-8", function(err) {
//   if (err) throw err;
//   console.log(err);
// });

// fs.readFile("users.json", "utf-8", function(err, data) {
//   if (err) throw err;
//   console.log(data);
//   valid_user = JSON.parse(data);
//   // valid_user.valid_user_list.push(infor);

//   console.log(valid_user);
//   exports.valid_user = valid_user;
// });

// group array
// fs.writeFile("groups.json", JSON.stringify(groups), "utf-8", function(err) {
//   if (err) throw err;
//   console.log(err);
// });

// fs.readFile("groups.json", "utf-8", function(err, data) {
//   if (err) throw err;
//   // console.log(groups);
//   groups = JSON.parse(data);
//   console.log(groups);
//   // exports.groups = groups;
// });

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
    require("./routes/auth-routes.js")(db, app);
    require("./routes/group-routes.js")(db, app, ObjectID);
  }
);
// routes
// require("./routes/auth-routes.js")(app, path);
// require("./routes/group-routes.js")(app, path);
