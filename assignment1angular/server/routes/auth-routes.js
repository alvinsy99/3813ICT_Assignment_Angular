var server = require("../server.js");
var fs = require("fs");

module.exports = function(db, app) {
  // retrieve all users
  const userCollection = db.collection("users");
  var admin_user = {
    email: "a-user@mail.com",
    username: "Super Admin A",
    password: "123a",
    isSuperAdmin: true,
    isGroupAdmin: true,
    valid: ""
  };
  userCollection.find({ email: "a-user@mail.com" }).count((err, count) => {
    if (count == 0) {
      userCollection.insertOne(admin_user, (err, dbres) => {
        if (err) throw err;
        console.log(dbres.insertCount);
      });
    }
  });
  console.log();
  app.get("/getusers", function(req, res) {
    // using mongodb
    userCollection.find({}).toArray((err, data) => {
      res.send(data);
    });

    // fs.readFile("users.json", "utf-8", function(err, data) {
    //   if (err) throw err;

    //   valid_user = JSON.parse(data);

    //   res.send(valid_user.valid_user_list);
    // });
  });

  // log in handler
  app.post("/api/auth", function(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }
    var customer = {};
    customer.email = "";
    customer.password = "";
    customer.username = "";
    customer.isSuperAdmin = false;
    customer.isGroupAdmin = false;
    customer.valid = false;
    // customer.email = req.body.email;
    // customer.password = req.body.password;
    // customer.username = req.body.username;
    // customer.birthday = req.body.birthday;
    // customer.age = req.body.age;

    console.log(req.body.email);

    userCollection
      .find({ email: req.body.email, password: req.body.password })
      .count((err, count) => {
        if (count == 0) {
          console.log("email or password is invalid");
          res.send(false);
        } else {
          userCollection
            .find({ email: req.body.email, password: req.body.password })
            .limit(1)
            .toArray((err, data) => {
              res.send(data);
            });
        }
      });
    // fs.readFile("users.json", "utf-8", function(err, data) {
    //   if (err) throw err;
    //   valid_user = JSON.parse(data);

    //   // check for email and password in the same object
    //   for (let i = 0; i < valid_user.valid_user_list.length; i++) {
    //     if (
    //       req.body.email == valid_user.valid_user_list[i].email &&
    //       req.body.password == valid_user.valid_user_list[i].password
    //     ) {
    //       customer.valid = true;
    //       customer.email = valid_user.valid_user_list[i].email;
    //       customer.password = valid_user.valid_user_list[i].password;
    //       customer.username = valid_user.valid_user_list[i].username;
    //       customer.isSuperAdmin = valid_user.valid_user_list[i].isSuperAdmin;
    //       customer.isGroupAdmin = valid_user.valid_user_list[i].isGroupAdmin;
    //       res.send(customer);
    //     }
    //   }
    // });
  });

  // user register handler
  app.post("/api/register", function(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }
    var customer = {};

    customer.email = "";
    customer.password = "";
    customer.username = "";
    customer.isSuperAdmin = false;
    customer.isGroupAdmin = false;

    userCollection
      .find({
        $or: [{ email: req.body.email }, { username: req.body.username }]
      })
      .count((err, count) => {
        console.log(count);
        if (count == 0) {
          customer.email = req.body.email;
          customer.username = req.body.username;
          customer.password = req.body.password;
          customer.isSuperAdmin = req.body.isSuperAdmin;
          customer.isGroupAdmin = req.body.isGroupAdmin;
          userCollection.insertOne(customer, (err, dbres) => {
            if (err) throw err;
          });
          res.send(true);
        } else {
          res.send(false);
        }
      });

    // fs.readFile("users.json", "utf-8", function(err, data) {
    //   if (err) throw err;
    //   valid_user = JSON.parse(data);

    //   // find whether email exist
    //   var exist_useremail = valid_user.valid_user_list
    //     .map(function(data) {
    //       return data.email;
    //     })
    //     .indexOf(req.body.email);

    //   // find whether username exist
    //   var exist_username = valid_user.valid_user_list
    //     .map(function(data) {
    //       return data.username;
    //     })
    //     .indexOf(req.body.username);

    //   // If both are -1 (means there is not available yet)
    //   // Then create
    //   if (exist_username == -1 && exist_useremail == -1) {
    //     customer.valid = true;
    //     customer.email = req.body.email;
    //     customer.username = req.body.username;
    //     customer.password = req.body.password;
    //     customer.isSuperAdmin = req.body.isSuperAdmin;
    //     customer.isGroupAdmin = req.body.isGroupAdmin;

    //     // update json file
    //     valid_user = JSON.parse(data);
    //     valid_user.valid_user_list.push(customer);
    //     console.log(valid_user);
    //     json = JSON.stringify(valid_user);
    //     fs.writeFile("users.json", json, "utf-8", function(err) {
    //       if (err) throw err;
    //     });
    //   } else {
    //     customer.valid = false;
    //   }
    //   res.send(customer);
    // });
  });

  // remove user handler
  app.post("/api/delete", function(req, res) {
    // console.log(server.valid_user.length);

    userCollection.deleteOne({ email: req.body.email }, (err, docs) => {
      res.send(true);
    });

    // fs.readFile("users.json", "utf-8", function(err, data) {
    //   if (err) throw err;
    //   console.log(data);
    //   valid_user = JSON.parse(data);
    //   console.log(valid_user);
    //   if (req.body.email !== "a-user@mail.com") {
    //     var user_index = valid_user.valid_user_list
    //       .map(function(data) {
    //         return data.email;
    //       })
    //       .indexOf(req.body.email);
    //     console.log(user_index);
    //     // delete valid_user[user_index];
    //     valid_user.valid_user_list.splice(user_index, 1);
    //     console.log(valid_user);
    //     console.log(valid_user.valid_user_list.length);
    //     data = true;
    //   }

    //   console.log(valid_user);
    //   json = JSON.stringify(valid_user);
    //   fs.writeFile("users.json", json, "utf-8", function(err) {
    //     if (err) throw err;
    //   });
    // });
    // res.send(data);
  });

  // Grand super admin role
  app.post("/grandsuper", function(req, res) {
    userCollection.updateOne(
      { email: req.body.email },
      { $set: { isSuperAdmin: true } },
      () => {
        res.send(true);
      }
    );

    // fs.readFile("users.json", "utf-8", function(err, data) {
    //   if (err) throw err;

    //   valid_user = JSON.parse(data);

    //   // Find user index
    //   var user_index = valid_user.valid_user_list
    //     .map(function(data) {
    //       return data.email;
    //     })
    //     .indexOf(req.body.email);

    //   // Check if user is already super admin
    //   if (valid_user.valid_user_list[user_index].isSuperAdmin == true) {
    //     res.send(false);
    //   } else {
    //     valid_user.valid_user_list[user_index].isSuperAdmin = true;
    //     json = JSON.stringify(valid_user);
    //     fs.writeFile("users.json", json, "utf-8", function(err) {
    //       if (err) throw err;
    //     });
    //     res.send(true);
    //   }
    //   console.log(valid_user.valid_user_list);
    // });
  });
};
