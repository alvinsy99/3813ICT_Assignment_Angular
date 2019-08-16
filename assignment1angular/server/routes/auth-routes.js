module.exports = function(app, path) {
  valid_user = [
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

  app.get("/getusers", function(req, res) {
    res.send(valid_user);
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

    for (let i = 0; i < valid_user.length; i++) {
      if (
        req.body.email == valid_user[i].email &&
        req.body.password == valid_user[i].password
      ) {
        customer.valid = true;
        customer.email = valid_user[i].email;
        customer.password = valid_user[i].password;
        customer.type = valid_user[i].type;
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
    for (let i = 0; i < valid_user.length; i++) {
      if (req.body.email == valid_user[i].email) {
        customer.valid = false;
        break;
      } else {
        customer.valid = "";
        customer.email = req.body.email;
        customer.password = req.body.password;
        customer.type = 2;
        valid_user.push(customer);
        break;
      }
    }

    res.send(customer);
    console.log(valid_user);
  });

  app.post("/api/delete", function(req, res) {
    data = false;
    console.log(valid_user.length);
    console.log(req.body.email);
    if (req.body.type !== 0 && req.body.type !== 1) {
      var user_index = valid_user
        .map(function(data) {
          return data.email;
        })
        .indexOf(req.body.email);
      console.log(user_index);
      // delete valid_user[user_index];
      valid_user.splice(user_index, 1);
      console.log(valid_user);
      console.log(valid_user.length);
      data = true;
    }

    res.send(data);
  });
};
