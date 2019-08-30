var server = require("../server.js");
var fs = require("fs");

// var find_group = groups
//   .map(name => {
//     return name.group_name;
//   })
//   .indexOf("First Group");

// console.log(find_group);

// var find_user = groups[0].members.map(mems => {
//   return mems;
// });

// var not_array_user = find_user.map(u => {
//   return u;
// });

// console.log(find_user);
// console.log(groups[0].members);
module.exports = function(app, path) {
  // Retrieve all groups
  app.get("/groups", function(req, res) {
    fs.readFile("groups.json", "utf-8", function(err, data) {
      if (err) throw err;
      groups = JSON.parse(data);

      res.send(groups.group_list);
    });
  });

  // Retrieve a specific group by name
  app.post("/getgroupbyname", function(req, res) {
    fs.readFile("groups.json", "utf-8", function(err, data) {
      if (err) throw err;
      groups = JSON.parse(data);
      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);
      res.send(groups.group_list[find_group]);
    });
  });

  // Remove user from a channel
  app.post("/removeuserchannel", function(req, res) {
    fs.readFile("groups.json", "utf-8", function(err, data) {
      if (err) throw err;
      groups = JSON.parse(data);

      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);

      var find_channel = groups.group_list[find_group].channels
        .map(name => {
          return name.channel_name;
        })
        .indexOf(req.body.channelname);

      var find_member = groups.group_list[find_group].channels[
        find_channel
      ].channel_members.indexOf(req.body.member);

      groups.group_list[find_group].channels[
        find_channel
      ].channel_members.splice(find_member, 1);

      console.log(
        groups.group_list[find_group].channels[find_channel].channel_members
      );
      res.send(groups);
      json = JSON.stringify(groups);
      fs.writeFile("groups.json", json, "utf-8", function(err) {
        if (err) throw err;
      });
    });
  });

  // Create channel
  app.post("/channel", function(req, res) {
    fs.readFile("groups.json", "utf-8", function(err, data) {
      if (err) throw err;
      groups = JSON.parse(data);

      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);
      // console.log(groups.group_list[find_group].channels);
      var find_channel = groups.group_list[find_group].channels
        .map(channel => {
          return channel.channel_name;
        })
        .indexOf(req.body.channelname);

      var current = groups.group_list[find_group].channels[find_channel];
      console.log(groups.group_list[find_group].channels[find_channel]);
      res.send(current);
    });
  });

  // Create new group
  app.post("/groups", function(req, res) {
    var new_group = {};

    new_group.group_name = "";
    new_group.group_admin = "";
    new_group.group_assist_1 = "";
    new_group.group_assist_2 = "";
    new_group.confirm = false;

    if (!req.body) {
      return res.sendStatus(400);
    }

    console.log(req.body.groupname);

    fs.readFile("groups.json", "utf-8", function(err, data) {
      if (err) throw err;
      groups = JSON.parse(data);
      console.log(groups);

      var exist_name = groups.group_list
        .map(function(name) {
          return name.group_name;
        })
        .indexOf(req.body.groupname);

      if (exist_name == -1) {
        new_group.group_name = req.body.groupname;
        new_group.group_admin = req.body.groupadmin;
        new_group.group_assist_1 = req.body.assist1;
        new_group.group_assist_2 = req.body.assist2;
        new_group.members = new Array(req.body.groupadmin);
        new_group.members.push(req.body.assist1);
        if (new_group.group_assist_2 !== "") {
          new_group.members.push(req.body.assist2);
        }

        groups.group_list.push(new_group);
        console.log(groups);
        json = JSON.stringify(groups);
        fs.writeFile("groups.json", json, "utf-8", function(err) {
          if (err) throw err;
        });
        new_group.confirm = true;
      } else {
        new_group.confirm = false;
      }
      res.send(new_group);
    });
  });

  // Add member to group
  app.post("/addmember", function(req, res) {
    // console.log(server.groups);

    if (!req.body) {
      return res.sendStatus(400);
    }
    var check = {};
    check.confirmation = "";
    fs.readFile("groups.json", "utf-8", function(err, data) {
      if (err) throw err;
      groups = JSON.parse(data);
      console.log(req.body.groupname);

      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);
      console.log(find_group);
      if (find_group !== -1) {
        var find_user = groups.group_list[find_group].members
          .map(mems => {
            return mems;
          })
          .indexOf(req.body.username);
      }
      console.log(find_user);
      if (find_user == -1 && find_group !== -1) {
        groups.group_list[find_group].members.push(req.body.username);
        json = JSON.stringify(groups);
        fs.writeFile("groups.json", json, "utf-8", function(err) {
          if (err) throw err;
        });
        check.confirmation = true;
      } else {
        check.confirmation = false;
      }

      res.send(check);
    });
  });

  // Remove  a group
  app.post("/removegroup", function(req, res) {
    fs.readFile("groups.json", "utf-8", function(err, data) {
      if (err) throw err;
      groups = JSON.parse(data);
      console.log(groups);

      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);

      console.log(find_group);

      groups.group_list.splice(find_group, 1);

      json = JSON.stringify(groups);
      fs.writeFile("groups.json", json, "utf-8", function(err) {
        if (err) throw err;
      });
    });
  });

  // Remove a member from group
  app.post("/removemember", function(req, res) {
    fs.readFile("groups.json", "utf-8", function(err, data) {
      var check = {};
      check.confirmation = false;
      if (err) throw err;
      groups = JSON.parse(data);
      console.log(groups);

      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);
      console.log(find_group);
      var find_user = groups.group_list[find_group].members
        .map(mems => {
          return mems;
        })
        .indexOf(req.body.membername);
      console.log(find_user);

      // Check if user being removing is the group assist 1
      if (req.body.membername == groups.group_list[find_group].group_assist_1) {
        if (groups.group_list[find_group].group_assist_2 !== "") {
          check.confirmation = true;
          groups.group_list[find_group].group_assist_1 = "";
          groups.group_list[find_group].members.splice(find_user, 1);
        } else {
          check.confirmation = false;
        }
      }
      // Check if user being removing is the group assist 2
      else if (
        req.body.membername == groups.group_list[find_group].group_assist_2
      ) {
        if (groups.group_list[find_group].group_assist_1 !== "") {
          check.confirmation = true;
          groups.group_list[find_group].group_assist_2 = "";
          groups.group_list[find_group].members.splice(find_user, 1);
        } else {
          check.confirmation = false;
        }
      } else {
        check.confirmation = true;
        groups.group_list[find_group].members.splice(find_user, 1);
      }

      // Group admin cannot be removed
      if (req.body.membername == groups.group_list[find_group].group_admin) {
        check.confirmation = false;
      }

      console.log(groups.group_list.members);
      json = JSON.stringify(groups);
      fs.writeFile("groups.json", json, "utf-8", function(err) {
        if (err) throw err;
      });
      res.send(check);
    });
  });

  // Create new a channel
  app.post("/channels", function(req, res) {
    fs.readFile("groups.json", "utf-8", function(err, data) {
      if (err) throw err;
      check = {};
      check.confirmation = false;
      channel = {};
      channel.channel_name = "";
      channel.channel_members = [];
      channel.channel_message = [];
      groups = JSON.parse(data);
      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);
      console.log(groups.group_list);
      console.log(groups.group_list[find_group].channels);
      console.log(groups.group_list[find_group].hasOwnProperty("channels"));

      // console.log(groups.group_list[find_group]["channels"]);
      if (groups.group_list[find_group].hasOwnProperty("channels")) {
        var exist_channel_name = groups.group_list[find_group].channels
          .map(channel => {
            return channel.channel_name;
          })
          .indexOf(req.body.channelname);

        if (exist_channel_name == -1) {
          check.confirmation = true;
          channel.channel_name = req.body.channelname;
          channel.channel_members.push(req.body.member);
          groups.group_list[find_group].channels.push(channel);
        } else {
          check.confirmation = false;
        }
      } else {
        channel.channel_name = req.body.channelname;
        channel.channel_members.push(req.body.member);
        groups.group_list[find_group].channels = new Array(channel);
        check.confirmation = true;

        console.log(groups.group_list[find_group]);
        console.log(groups.group_list[find_group].channels);
      }
      json = JSON.stringify(groups);
      fs.writeFile("groups.json", json, "utf-8", function(err) {
        if (err) throw err;
      });

      res.send(check);
    });
  });

  // Add a group memeber to channel
  app.post("/addUserToChannel", function(req, res) {
    console.log(req.body.channelname);
    console.log(req.body.groupname);
    console.log(req.body.member);

    fs.readFile("groups.json", "utf-8", function(err, data) {
      if (err) throw err;
      check = {};
      check.confirmation = false;
      groups = JSON.parse(data);
      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);
      // console.log(groups.group_list[find_group].channels);
      var find_channel = groups.group_list[find_group].channels
        .map(channel => {
          return channel.channel_name;
        })
        .indexOf(req.body.channelname);

      var find_member_in_group = groups.group_list[find_group].channels[
        find_channel
      ].channel_members.indexOf(req.body.member);

      if (find_member_in_group == -1 && req.body.member !== "") {
        groups.group_list[find_group].channels[
          find_channel
        ].channel_members.push(req.body.member);
        check.confirmation = true;
      } else {
        check.confirmation = false;
      }
      console.log(groups.group_list[find_group].channels[find_channel]);
      json = JSON.stringify(groups);
      fs.writeFile("groups.json", json, "utf-8", function(err) {
        if (err) throw err;
      });
      res.send(check);
    });
  });

  // Remove a channel
  app.post("/removechannel", function(req, res) {
    fs.readFile("groups.json", "utf-8", function(err, data) {
      if (err) throw err;
      groups = JSON.parse(data);

      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);

      var find_channel = groups.group_list[find_group].channels
        .map(channel => {
          return channel.channel_name;
        })
        .indexOf(req.body.channelname);

      groups.group_list[find_group].channels.splice(find_channel, 1);
      console.log(groups.group_list[find_group].channels);

      json = JSON.stringify(groups);
      fs.writeFile("groups.json", json, "utf-8", function(err) {
        if (err) throw err;
      });
    });
  });
};
