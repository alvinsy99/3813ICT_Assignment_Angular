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
module.exports = function(db, app, ObjectID) {
  // Retrieve all groups
  const groupCollection = db.collection("groups");

  app.get("/groups", function(req, res) {
    groupCollection.find({}).toArray((err, data) => {
      console.log(data[0]);
      res.send(data);
    });
  });

  // Retrieve a specific group by name
  app.post("/getgroupbyname", function(req, res) {
    // fs.readFile("groups.json", "utf-8", function(err, data) {
    //   if (err) throw err;
    //   groups = JSON.parse(data);

    //   // find group in the group_list array
    //   var find_group = groups.group_list
    //     .map(name => {
    //       return name.group_name;
    //     })
    //     .indexOf(req.body.groupname);

    //   // return that index object
    //   res.send(groups.group_list[find_group]);
    // });

    groupCollection
      .find({ group_name: req.body.groupname })
      .limit(1)
      .toArray((err, docs) => {
        console.log(docs);
        res.send(docs);
      });
  });

  // Remove user from a channel
  app.post("/removeuserchannel", function(req, res) {
    groupCollection.updateOne(
      {
        group_name: req.body.groupname,
        channels: { $elemMatch: { channel_name: req.body.channelname } }
      },
      { $pull: { "channels.$.channel_members": req.body.member } }
    );

    res.send(true);
    // fs.readFile("groups.json", "utf-8", function(err, data) {
    //   if (err) throw err;
    //   groups = JSON.parse(data);
    //   // find group index in group_list array
    //   var find_group = groups.group_list
    //     .map(name => {
    //       return name.group_name;
    //     })
    //     .indexOf(req.body.groupname);
    //   // find channels in the previous group index
    //   var find_channel = groups.group_list[find_group].channels
    //     .map(name => {
    //       return name.channel_name;
    //     })
    //     .indexOf(req.body.channelname);
    //   // find the user in the channel index
    //   // based on the last 2 searches
    //   var find_member = groups.group_list[find_group].channels[
    //     find_channel
    //   ].channel_members.indexOf(req.body.member);
    //   // remove that user from channel
    //   groups.group_list[find_group].channels[
    //     find_channel
    //   ].channel_members.splice(find_member, 1);
    //   console.log(
    //     groups.group_list[find_group].channels[find_channel].channel_members
    //   );
    //   res.send(groups);
    //   json = JSON.stringify(groups);
    //   fs.writeFile("groups.json", json, "utf-8", function(err) {
    //     if (err) throw err;
    //   });
    // });
  });

  // Retrive a specfic channel
  app.post("/channel", function(req, res) {
    var vardata;
    var channelarray = groupCollection
      .find({
        group_name: req.body.groupname,
        channels: { $elemMatch: { channel_name: req.body.channelname } }
      })
      .limit(1)
      .toArray((err, data) => {
        console.log(data[0].channels);

        var find_channel = data[0].channels
          .map(channel => {
            return channel.channel_name;
          })
          .indexOf(req.body.channelname);

        res.send(data[0].channels[find_channel]);
      });

    // console.log(
    //   groupCollection.find(
    //     {},
    //     { channels: { $elemMatch: { channel_name: req.body.channelname } } }
    //   )
    // );

    // fs.readFile("groups.json", "utf-8", function(err, data) {
    //   if (err) throw err;
    //   groups = JSON.parse(data);
    //   // find group index in group_list array
    //   var find_group = groups.group_list
    //     .map(name => {
    //       return name.group_name;
    //     })
    //     .indexOf(req.body.groupname);
    //   // console.log(groups.group_list[find_group].channels);
    //   // find channel based on group index
    //   var find_channel = groups.group_list[find_group].channels
    //     .map(channel => {
    //       return channel.channel_name;
    //     })
    //     .indexOf(req.body.channelname);
    //   // Return channel object
    //   var current = groups.group_list[find_group].channels[find_channel];
    //   console.log(groups.group_list[find_group].channels[find_channel]);
    //   res.send(current);
    // });
  });

  // Create new group
  app.post("/groups", function(req, res) {
    var new_group = {};

    new_group.group_name = "";
    new_group.group_admin = "";
    new_group.group_assist_1 = "";
    new_group.group_assist_2 = "";
    new_group.channels = [];

    if (!req.body) {
      return res.sendStatus(400);
    }

    console.log(req.body.groupname);

    groupCollection
      .find({ group_name: req.body.groupname })
      .count((err, count) => {
        if (count == 0) {
          new_group.group_name = req.body.groupname;
          new_group.group_admin = req.body.groupadmin;
          new_group.group_assist_1 = req.body.assist1;
          new_group.group_assist_2 = req.body.assist2;
          new_group.members = new Array(req.body.groupadmin);
          if (new_group.group_admin !== new_group.group_assist_1) {
            new_group.members.push(req.body.assist1);
          }
          if (
            new_group.group_assist_2 !== "" &&
            new_group.group_admin !== new_group.group_assist_2
          ) {
            new_group.members.push(req.body.assist2);
          }

          groupCollection.insertOne(new_group, (err, data) => {
            if (err) throw err;
          });
          res.send(true);
        } else {
          res.send(false);
        }
      });

    // fs.readFile("groups.json", "utf-8", function(err, data) {
    //   if (err) throw err;
    //   groups = JSON.parse(data);
    //   console.log(groups);

    //   // find group index in group_list array
    //   var exist_name = groups.group_list
    //     .map(function(name) {
    //       return name.group_name;
    //     })
    //     .indexOf(req.body.groupname);

    //   // if the group name is not yet existed
    //   // then create
    //   if (exist_name == -1) {
    //     new_group.group_name = req.body.groupname;
    //     new_group.group_admin = req.body.groupadmin;
    //     new_group.group_assist_1 = req.body.assist1;
    //     new_group.group_assist_2 = req.body.assist2;
    //     new_group.members = new Array(req.body.groupadmin);
    //     new_group.members.push(req.body.assist1);
    //     if (new_group.group_assist_2 !== "") {
    //       new_group.members.push(req.body.assist2);
    //     }

    //     groups.group_list.push(new_group);
    //     console.log(groups);
    //     json = JSON.stringify(groups);
    //     fs.writeFile("groups.json", json, "utf-8", function(err) {
    //       if (err) throw err;
    //     });
    //     new_group.confirm = true;
    //   } else {
    //     new_group.confirm = false;
    //   }
    //   res.send(new_group);
    // });
  });

  // Add member to group
  app.post("/addmember", function(req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }

    var objectID = new ObjectID(req.body.obID);
    console.log(objectID);
    console.log(req.body.groupname);
    groupCollection
      .find({ group_name: req.body.groupname, members: req.body.username })
      .count((err, count) => {
        if (count == 0) {
          groupCollection.updateOne(
            { _id: objectID },
            { $push: { members: req.body.username } },
            (err, data) => {
              res.send(true);
            }
          );
        } else {
          res.send(false);
        }
      });
    // fs.readFile("groups.json", "utf-8", function(err, data) {
    //   if (err) throw err;
    //   groups = JSON.parse(data);
    //   console.log(req.body.groupname);

    //   // find group index in group_list array
    //   var find_group = groups.group_list
    //     .map(name => {
    //       return name.group_name;
    //     })
    //     .indexOf(req.body.groupname);
    //   console.log(find_group);
    //   if (find_group !== -1) {
    //     // Find user in the group index
    //     var find_user = groups.group_list[find_group].members
    //       .map(mems => {
    //         return mems;
    //       })
    //       .indexOf(req.body.username);
    //   }
    //   console.log(find_user);

    //   // If both are -1 (means they are not exist)
    //   // then create
    //   if (find_user == -1 && find_group !== -1) {
    //     groups.group_list[find_group].members.push(req.body.username);
    //     json = JSON.stringify(groups);
    //     fs.writeFile("groups.json", json, "utf-8", function(err) {
    //       if (err) throw err;
    //     });
    //     check.confirmation = true;
    //   } else {
    //     check.confirmation = false;
    //   }

    //   res.send(check);
    // });
  });

  // Remove  a group
  app.post("/removegroup", function(req, res) {
    groupCollection.deleteOne(
      { group_name: req.body.groupname },
      (err, docs) => {
        res.send(true);
      }
    );

    // fs.readFile("groups.json", "utf-8", function(err, data) {
    //   if (err) throw err;
    //   groups = JSON.parse(data);
    //   console.log(groups);

    //   // find group index in group_list array
    //   var find_group = groups.group_list
    //     .map(name => {
    //       return name.group_name;
    //     })
    //     .indexOf(req.body.groupname);

    //   console.log(find_group);

    //   // Remove the group object
    //   groups.group_list.splice(find_group, 1);
    //   data = true;
    //   json = JSON.stringify(groups);
    //   fs.writeFile("groups.json", json, "utf-8", function(err) {
    //     if (err) throw err;
    //   });
    // });
    // res.send(data);
  });

  // Remove a member from group
  app.post("/removemember", function(req, res) {
    groupCollection.updateOne(
      { group_name: req.body.groupname },
      { $pull: { members: req.body.membername } },
      (err, data) => {
        res.send(true);
      }
    );

    // fs.readFile("groups.json", "utf-8", function(err, data) {
    //   var check = {};
    //   check.confirmation = false;
    //   if (err) throw err;
    //   groups = JSON.parse(data);

    //   // find group index in group_list array
    //   var find_group = groups.group_list
    //     .map(name => {
    //       return name.group_name;
    //     })
    //     .indexOf(req.body.groupname);
    //   console.log(find_group);

    //   // find user index in the group index object
    //   var find_user = groups.group_list[find_group].members
    //     .map(mems => {
    //       return mems;
    //     })
    //     .indexOf(req.body.membername);
    //   console.log(find_user);
    //   console.log(groups.group_list[find_group].members);
    //   // Check if user being removing is the group assist 1
    //   if (req.body.membername == groups.group_list[find_group].group_assist_1) {
    //     if (groups.group_list[find_group].group_assist_2 !== "") {
    //       check.confirmation = true;
    //       groups.group_list[find_group].group_assist_1 = "";
    //       groups.group_list[find_group].members.splice(find_user, 1);
    //     } else {
    //       check.confirmation = false;
    //     }
    //   }
    //   // Check if user being removing is the group assist 2
    //   else if (
    //     req.body.membername == groups.group_list[find_group].group_assist_2
    //   ) {
    //     if (groups.group_list[find_group].group_assist_1 !== "") {
    //       check.confirmation = true;
    //       groups.group_list[find_group].group_assist_2 = "";
    //       groups.group_list[find_group].members.splice(find_user, 1);
    //     } else {
    //       check.confirmation = false;
    //     }
    //   }
    //   // Group admin cannot be removed
    //   else if (
    //     req.body.membername == groups.group_list[find_group].group_admin
    //   ) {
    //     check.confirmation = false;
    //   } else {
    //     check.confirmation = true;
    //     groups.group_list[find_group].members.splice(find_user, 1);
    //   }

    //   console.log(groups.group_list[find_group].members);
    //   json = JSON.stringify(groups);
    //   fs.writeFile("groups.json", json, "utf-8", function(err) {
    //     if (err) throw err;
    //   });
    //   res.send(check);
    // });
  });

  // Create new a channel
  app.post("/channels", function(req, res) {
    console.log(
      groupCollection
        .find({
          group_name: req.body.groupname,
          channels: { channel_name: req.body.channelname }
        })
        .count((err, count) => {
          console.log(count);
        })
    );
    // console.log(groupCollection.find({ channels: { exists: true } }));
    // channel_members_array = new Array(req.body.membername);
    new_channel = {};
    new_channel.channel_name = req.body.channelname;
    new_channel.channel_members = [req.body.member];
    new_channel.channel_message = [];
    groupCollection
      .find({
        group_name: req.body.groupname,
        channels: { $elemMatch: { channel_name: req.body.channelname } }
      })
      .count((err, count) => {
        if (count == 0) {
          // groupCollection.find({ channels: { exists: false } });
          groupCollection.updateOne(
            { group_name: req.body.groupname },
            {
              $push: { channels: new_channel }
            },
            () => {
              console.log(req.body.groupname.channels);
              res.send(true);
            }
          );
        } else {
          res.send(false);
        }
      });
    // fs.readFile("groups.json", "utf-8", function(err, data) {
    //   if (err) throw err;
    //   check = {};
    //   check.confirmation = false;
    //   channel = {};
    //   channel.channel_name = "";
    //   channel.channel_members = [];
    //   channel.channel_message = [];
    //   groups = JSON.parse(data);

    //   // find group index in group_list array
    //   var find_group = groups.group_list
    //     .map(name => {
    //       return name.group_name;
    //     })
    //     .indexOf(req.body.groupname);

    //   // console.log(groups.group_list[find_group]["channels"]);

    //   // Check if the group index already had channel key
    //   // If do which means the channels might have been created before
    //   // If not then create the channel along with 'channels' key
    //   if (groups.group_list[find_group].hasOwnProperty("channels")) {
    //     // if 'channel' key exist then check for channel name
    //     var exist_channel_name = groups.group_list[find_group].channels
    //       .map(channel => {
    //         return channel.channel_name;
    //       })
    //       .indexOf(req.body.channelname);

    //     // if channel is not yet created then create
    //     if (exist_channel_name == -1 || req.body.channelname !== "") {
    //       check.confirmation = true;
    //       channel.channel_name = req.body.channelname;
    //       channel.channel_members.push(req.body.member);
    //       groups.group_list[find_group].channels.push(channel);
    //     } else {
    //       check.confirmation = false;
    //     }
    //   } else if (req.body.channelname !== "") {
    //     channel.channel_name = req.body.channelname;
    //     channel.channel_members.push(req.body.member);
    //     groups.group_list[find_group].channels = new Array(channel);
    //     check.confirmation = true;

    //     console.log(groups.group_list[find_group]);
    //     console.log(groups.group_list[find_group].channels);
    //   } else {
    //     check.confirmation = false;
    //   }

    //   json = JSON.stringify(groups);
    //   fs.writeFile("groups.json", json, "utf-8", function(err) {
    //     if (err) throw err;
    //   });

    //   res.send(check);
    // });
  });

  // Add a group memeber to channel
  app.post("/addUserToChannel", function(req, res) {
    console.log(req.body.channelname);
    console.log(req.body.groupname);
    console.log(req.body.member);

    // groupCollection
    //   .find({
    //     group_name: req.body.groupname,
    //     channels: { $elemMatch: { channel_name: req.body.channelname } },
    //     "channels.$.channel_members": req.body.member
    //   })
    //   .count((err, count) => {
    //     console.log(count);
    //   });

    groupCollection
      .find({
        group_name: req.body.groupname,
        channels: { $elemMatch: { channel_name: req.body.channelname } }
      })
      .toArray((err, data) => {
        console.log(data[0].channels);

        var find_member_1 = data[0].channels.map(channel => {
          return channel.channel_members;
        });

        var find_member = find_member_1[0].indexOf(req.body.member);
        if (find_member == -1) {
          groupCollection.updateOne(
            {
              group_name: req.body.groupname,
              channels: { $elemMatch: { channel_name: req.body.channelname } }
            },
            { $push: { "channels.$.channel_members": req.body.member } }
          );

          res.send(true);
        } else {
          res.send(false);
        }
      });

    // fs.readFile("groups.json", "utf-8", function(err, data) {
    //   if (err) throw err;
    //   check = {};
    //   check.confirmation = false;
    //   groups = JSON.parse(data);

    //   // find group index in group_list array
    //   var find_group = groups.group_list
    //     .map(name => {
    //       return name.group_name;
    //     })
    //     .indexOf(req.body.groupname);
    //   // console.log(groups.group_list[find_group].channels);

    //   // find channel index in the group index
    //   var find_channel = groups.group_list[find_group].channels
    //     .map(channel => {
    //       return channel.channel_name;
    //     })
    //     .indexOf(req.body.channelname);

    //   // find the member in the channel index
    //   var find_member_in_group = groups.group_list[find_group].channels[
    //     find_channel
    //   ].channel_members.indexOf(req.body.member);

    //   // If member is not in that channel yet then add
    //   if (find_member_in_group == -1 && req.body.member !== "") {
    //     groups.group_list[find_group].channels[
    //       find_channel
    //     ].channel_members.push(req.body.member);
    //     check.confirmation = true;
    //   } else {
    //     check.confirmation = false;
    //   }
    //   console.log(groups.group_list[find_group].channels[find_channel]);
    //   json = JSON.stringify(groups);
    //   fs.writeFile("groups.json", json, "utf-8", function(err) {
    //     if (err) throw err;
    //   });
    //   res.send(check);
    // });
  });

  // Remove a channel
  app.post("/removechannel", function(req, res) {
    // groupCollection.deleteOne({
    //   $and: [
    //     { group_name: req.body.groupname },
    //     { channels: { $elemMatch: { channel_name: req.body.channelname } } }
    //   ]
    // });

    groupCollection.updateOne(
      {
        group_name: req.body.groupname
      },
      {
        $pull: {
          channels: { channel_name: req.body.channelname }
        }
      }
    );

    // fs.readFile("groups.json", "utf-8", function(err, data) {
    //   if (err) throw err;
    //   groups = JSON.parse(data);

    //   // find group index in group_list array
    //   var find_group = groups.group_list
    //     .map(name => {
    //       return name.group_name;
    //     })
    //     .indexOf(req.body.groupname);

    //   // find the channel in the group index object
    //   var find_channel = groups.group_list[find_group].channels
    //     .map(channel => {
    //       return channel.channel_name;
    //     })
    //     .indexOf(req.body.channelname);

    //   // Remove that channel
    //   groups.group_list[find_group].channels.splice(find_channel, 1);
    //   console.log(groups.group_list[find_group].channels);

    //   json = JSON.stringify(groups);
    //   fs.writeFile("groups.json", json, "utf-8", function(err) {
    //     if (err) throw err;
    //   });
    // });
  });
};
