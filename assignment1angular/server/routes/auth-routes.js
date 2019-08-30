var server = require("../server.js");
var fs = require("fs");

module.exports = function(app, path) {
  // retrieve all users
  app.get("/getusers", function(req, res) {
    fs.readFile("users.json", "utf-8", function(err, data) {
      if (err) throw err;

      valid_user = JSON.parse(data);

      res.send(valid_user.valid_user_list);
    });
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
    fs.readFile("users.json", "utf-8", function(err, data) {
      if (err) throw err;
      valid_user = JSON.parse(data);
      // check for email and password in the same object
      for (let i = 0; i < valid_user.valid_user_list.length; i++) {
        if (
          req.body.email == valid_user.valid_user_list[i].email &&
          req.body.password == valid_user.valid_user_list[i].password
        ) {
          customer.valid = true;
          customer.email = valid_user.valid_user_list[i].email;
          customer.password = valid_user.valid_user_list[i].password;
          customer.username = valid_user.valid_user_list[i].username;
          customer.isSuperAdmin = valid_user.valid_user_list[i].isSuperAdmin;
          customer.isGroupAdmin = valid_user.valid_user_list[i].isGroupAdmin;
          res.send(customer);
        }
      }
    });
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
    customer.valid = false;

    console.log(req.body.email);

    fs.readFile("users.json", "utf-8", function(err, data) {
      if (err) throw err;
      valid_user = JSON.parse(data);
      var exist_useremail = valid_user.valid_user_list
        .map(function(data) {
          return data.email;
        })
        .indexOf(req.body.email);

      var exist_username = valid_user.valid_user_list
        .map(function(data) {
          return data.username;
        })
        .indexOf(req.body.username);

      if (exist_username == -1 && exist_useremail == -1) {
        customer.valid = true;
        customer.email = req.body.email;
        customer.username = req.body.username;
        customer.password = req.body.password;
        customer.isSuperAdmin = req.body.isSuperAdmin;
        customer.isGroupAdmin = req.body.isGroupAdmin;

        // update json file
        valid_user = JSON.parse(data);
        valid_user.valid_user_list.push(customer);
        console.log(valid_user);
        json = JSON.stringify(valid_user);
        fs.writeFile("users.json", json, "utf-8", function(err) {
          if (err) throw err;
        });
      } else {
        customer.valid = false;
      }
      res.send(customer);
    });

    // if username and email = -1
    // it means there it no existence data
    // then push new user to the array
  });

  // remove user handler
  app.post("/api/delete", function(req, res) {
    data = false;
    // console.log(server.valid_user.length);

    fs.readFile("users.json", "utf-8", function(err, data) {
      if (err) throw err;
      console.log(data);
      valid_user = JSON.parse(data);
      console.log(valid_user);
      if (req.body.email !== "a-user@mail.com") {
        var user_index = valid_user.valid_user_list
          .map(function(data) {
            return data.email;
          })
          .indexOf(req.body.email);
        console.log(user_index);
        // delete valid_user[user_index];
        valid_user.valid_user_list.splice(user_index, 1);
        console.log(valid_user);
        console.log(valid_user.valid_user_list.length);
        data = true;
      }

      console.log(valid_user);
      json = JSON.stringify(valid_user);
      fs.writeFile("users.json", json, "utf-8", function(err) {
        if (err) throw err;
      });
    });
    res.send(data);
  });

  app.post("/grandsuper", function(req, res) {
    fs.readFile("users.json", "utf-8", function(err, data) {
      if (err) throw err;

      valid_user = JSON.parse(data);

      var user_index = valid_user.valid_user_list
        .map(function(data) {
          return data.email;
        })
        .indexOf(req.body.email);
      if (valid_user.valid_user_list[user_index].isSuperAdmin == true) {
        res.send(false);
      } else {
        valid_user.valid_user_list[user_index].isSuperAdmin = true;
        json = JSON.stringify(valid_user);
        fs.writeFile("users.json", json, "utf-8", function(err) {
          if (err) throw err;
        });
        res.send(true);
      }
      console.log(valid_user.valid_user_list);
    });
  });
};
