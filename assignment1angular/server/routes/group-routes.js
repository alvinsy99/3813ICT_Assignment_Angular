var server = require("../server.js");

var groups = [
  {
    group_name: "First Group",
    members: ["b-user@mail.com", "a-user@mail.com"]
  },

  {
    group_name: "Second Group",
    members: ["b-user@mail.com", "c-user@mail.com"]
  }
];
// var find_group = groups
//   .map(name => {
//     return name.group_name;
//   })
//   .indexOf("First Group");

// console.log(find_group);

var find_user = groups[0].members.map(mems => {
  return mems;
});
// var not_array_user = find_user.map(u => {
//   return u;
// });
// console.log(not_array_user);
console.log(find_user);
// console.log(groups[0].members);
module.exports = function(app, path) {
  app.get("/groups", function(req, res) {
    res.send(groups);
  });

  app.post("/groups", function(req, res) {
    var new_group = {};

    new_group.group_name = "";

    new_group.confirm = false;

    if (!req.body) {
      return res.sendStatus(400);
    }

    console.log(req.body.groupname);
    var exist_name = groups
      .map(function(name) {
        return name.group_name;
      })
      .indexOf(req.body.groupname);

    if (exist_name == -1) {
      new_group.group_name = req.body.groupname;
      new_group.members = new Array(req.body.email);

      groups.push(new_group);
      new_group.confirm = true;
    } else {
      new_group.confirm = false;
    }
    console.log(groups);
    res.send(new_group);
  });

  app.post("/addmember", function(req, res) {
    console.log(groups);
    console.log(req.body.groupname);

    if (!req.body) {
      return res.sendStatus(400);
    }
    var check = {};
    check.confirmation = "";

    var find_group = groups
      .map(name => {
        return name.group_name;
      })
      .indexOf(req.body.groupname);

    if (find_group !== -1) {
      var find_user = groups[find_group].members
        .map(mems => {
          return mems;
        })
        .indexOf(req.body.email);
    }

    if (find_user == -1 && find_group !== -1) {
      groups[find_group].members.push(req.body.email);
      check.confirmation = true;
    } else {
      check.confirmation = false;
    }

    res.send(check);
  });

  app.post("/removegroup", function(req, res) {
    var find_group = groups
      .map(name => {
        return name.group_name;
      })
      .indexOf(req.body.groupname);

    console.log(find_group);

    groups.splice(find_group, 1);
  });

  app.post("/removemember", function(req, res) {
    var check = {};
    check.confirmation = false;

    var find_group = groups
      .map(name => {
        return name.group_name;
      })
      .indexOf(req.body.groupname);
    console.log(find_group);
    var find_user = groups[find_group].members
      .map(mems => {
        return mems;
      })
      .indexOf(req.body.membername);
    console.log(find_user);
    if (find_user !== 0) {
      check.confirmation = true;
      groups[find_group].members.splice(find_user, 1);
    } else {
      check.confirmation = false;
    }

    res.send(check);
  });
};
