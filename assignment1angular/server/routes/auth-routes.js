var server = require("../server.js");

module.exports = function(app, path) {
  app.get("/getusers", function(req, res) {
    res.send(server.valid_user);
  });

  app.post("/api/auth", function(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }
    var customer = {};
    customer.email = "";
    customer.password = "";
    customer.type = 3;
    customer.valid = false;
    // customer.email = req.body.email;
    // customer.password = req.body.password;
    // customer.username = req.body.username;
    // customer.birthday = req.body.birthday;
    // customer.age = req.body.age;

    console.log(req.body.email);

    for (let i = 0; i < server.valid_user.length; i++) {
      if (
        req.body.email == server.valid_user[i].email &&
        req.body.password == server.valid_user[i].password
      ) {
        customer.valid = true;
        customer.email = server.valid_user[i].email;
        customer.password = server.valid_user[i].password;
        customer.type = server.valid_user[i].type;
      }
    }

    res.send(customer);
  });

  app.post("/api/register", function(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }
    var customer = {};

    customer.email = "";
    customer.password = "";
    customer.type = 2;
    customer.valid = false;

    console.log(req.body.email);
    // for (let i = 0; i < valid_user.length; i++) {
    //   if (req.body.email !== valid_user[i].email) {
    //     customer.valid = "";
    //     customer.email = req.body.email;
    //     customer.password = req.body.password;
    //     customer.type = 2;
    //     valid_user.push(customer);
    //     break;
    //   } else {
    //     customer.valid = false;
    //     res.send(customer);
    //     console.log(customer.valid + "from here");
    //   }
    // }

    var exist_user = server.valid_user
      .map(function(data) {
        return data.email;
      })
      .indexOf(req.body.email);

    console.log(exist_user);
    if (exist_user == -1) {
      customer.valid = "";
      customer.email = req.body.email;
      customer.password = req.body.password;
      customer.type = 2;
      server.valid_user.push(customer);
    } else {
      customer.valid = false;
    }

    res.send(customer);
    console.log(customer.valid + "customer valid");
    console.log(server.valid_user);
  });

  app.post("/api/delete", function(req, res) {
    data = false;
    console.log(server.valid_user.length);

    if (req.body.type !== 0 && req.body.type !== 1) {
      var user_index = server.valid_user
        .map(function(data) {
          return data.email;
        })
        .indexOf(req.body.email);
      console.log(user_index);
      // delete valid_user[user_index];
      server.valid_user.splice(user_index, 1);
      console.log(server.valid_user);
      console.log(server.valid_user.length);
      data = true;
    }

    res.send(data);
  });
};
