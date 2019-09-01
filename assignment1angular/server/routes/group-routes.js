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

      // find group in the group_list array
      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);

      // return that index object
      res.send(groups.group_list[find_group]);
    });
  });

  // Remove user from a channel
  app.post("/removeuserchannel", function(req, res) {
    fs.readFile("groups.json", "utf-8", function(err, data) {
      if (err) throw err;
      groups = JSON.parse(data);

      // find group index in group_list array
      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);

      // find channels in the previous group index
      var find_channel = groups.group_list[find_group].channels
        .map(name => {
          return name.channel_name;
        })
        .indexOf(req.body.channelname);

      // find the user in the channel index
      // based on the last 2 searches
      var find_member = groups.group_list[find_group].channels[
        find_channel
      ].channel_members.indexOf(req.body.member);

      // remove that user from channel
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

  // Retrive a specfic channel
  app.post("/channel", function(req, res) {
    fs.readFile("groups.json", "utf-8", function(err, data) {
      if (err) throw err;
      groups = JSON.parse(data);

      // find group index in group_list array
      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);
      // console.log(groups.group_list[find_group].channels);

      // find channel based on group index
      var find_channel = groups.group_list[find_group].channels
        .map(channel => {
          return channel.channel_name;
        })
        .indexOf(req.body.channelname);

      // Return channel object
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

      // find group index in group_list array
      var exist_name = groups.group_list
        .map(function(name) {
          return name.group_name;
        })
        .indexOf(req.body.groupname);

      // if the group name is not yet existed
      // then create
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

      // find group index in group_list array
      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);
      console.log(find_group);
      if (find_group !== -1) {
        // Find user in the group index
        var find_user = groups.group_list[find_group].members
          .map(mems => {
            return mems;
          })
          .indexOf(req.body.username);
      }
      console.log(find_user);

      // If both are -1 (means they are not exist)
      // then create
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
    data = false;
    fs.readFile("groups.json", "utf-8", function(err, data) {
      if (err) throw err;
      groups = JSON.parse(data);
      console.log(groups);

      // find group index in group_list array
      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);

      console.log(find_group);

      // Remove the group object
      groups.group_list.splice(find_group, 1);
      data = true;
      json = JSON.stringify(groups);
      fs.writeFile("groups.json", json, "utf-8", function(err) {
        if (err) throw err;
      });
    });
    res.send(data);
  });

  // Remove a member from group
  app.post("/removemember", function(req, res) {
    fs.readFile("groups.json", "utf-8", function(err, data) {
      var check = {};
      check.confirmation = false;
      if (err) throw err;
      groups = JSON.parse(data);

      // find group index in group_list array
      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);
      console.log(find_group);

      // find user index in the group index object
      var find_user = groups.group_list[find_group].members
        .map(mems => {
          return mems;
        })
        .indexOf(req.body.membername);
      console.log(find_user);
      console.log(groups.group_list[find_group].members);
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
      }
      // Group admin cannot be removed
      else if (
        req.body.membername == groups.group_list[find_group].group_admin
      ) {
        check.confirmation = false;
      } else {
        check.confirmation = true;
        groups.group_list[find_group].members.splice(find_user, 1);
      }

      console.log(groups.group_list[find_group].members);
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

      // find group index in group_list array
      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);

      // console.log(groups.group_list[find_group]["channels"]);

      // Check if the group index already had channel key
      // If do which means the channels might have been created before
      // If not then create the channel along with 'channels' key
      if (groups.group_list[find_group].hasOwnProperty("channels")) {
        // if 'channel' key exist then check for channel name
        var exist_channel_name = groups.group_list[find_group].channels
          .map(channel => {
            return channel.channel_name;
          })
          .indexOf(req.body.channelname);

        // if channel is not yet created then create
        if (exist_channel_name == -1 || req.body.channelname !== "") {
          check.confirmation = true;
          channel.channel_name = req.body.channelname;
          channel.channel_members.push(req.body.member);
          groups.group_list[find_group].channels.push(channel);
        } else {
          check.confirmation = false;
        }
      } else if (req.body.channelname !== "") {
        channel.channel_name = req.body.channelname;
        channel.channel_members.push(req.body.member);
        groups.group_list[find_group].channels = new Array(channel);
        check.confirmation = true;

        console.log(groups.group_list[find_group]);
        console.log(groups.group_list[find_group].channels);
      } else {
        check.confirmation = false;
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

      // find group index in group_list array
      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);
      // console.log(groups.group_list[find_group].channels);

      // find channel index in the group index
      var find_channel = groups.group_list[find_group].channels
        .map(channel => {
          return channel.channel_name;
        })
        .indexOf(req.body.channelname);

      // find the member in the channel index
      var find_member_in_group = groups.group_list[find_group].channels[
        find_channel
      ].channel_members.indexOf(req.body.member);

      // If member is not in that channel yet then add
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

      // find group index in group_list array
      var find_group = groups.group_list
        .map(name => {
          return name.group_name;
        })
        .indexOf(req.body.groupname);

      // find the channel in the group index object
      var find_channel = groups.group_list[find_group].channels
        .map(channel => {
          return channel.channel_name;
        })
        .indexOf(req.body.channelname);

      // Remove that channel
      groups.group_list[find_group].channels.splice(find_channel, 1);
      console.log(groups.group_list[find_group].channels);

      json = JSON.stringify(groups);
      fs.writeFile("groups.json", json, "utf-8", function(err) {
        if (err) throw err;
      });
    });
  });
};
