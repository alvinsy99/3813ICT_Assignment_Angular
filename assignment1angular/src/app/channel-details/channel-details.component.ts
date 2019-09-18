import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { LoginServiceService } from "../services/login-service.service";

@Component({
  selector: "app-channel-details",
  templateUrl: "./channel-details.component.html",
  styleUrls: ["./channel-details.component.css"]
})
export class ChannelDetailsComponent implements OnInit {
  group;
  session = JSON.parse(sessionStorage.getItem("sessionUser"));
  group_name;
  channel_name;
  channelMembers = [];

  selectedUserChannel = "";

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private loginService: LoginServiceService
  ) {}

  ngOnInit() {
    // Retrieve the parameters from the url
    this.activatedroute.params.subscribe((params: Params) => {
      this.group_name = params.gname;
      this.channel_name = params.cname; // (+) converts string 'id' to a number
    });

    // Retrieve a channel object
    this.loginService
      .getChannel(this.channel_name, this.group_name)
      .subscribe(data => {
        console.log("HERE");
        console.log(data);
        this.channelMembers = data.channel_members;
      });
    this.loginService.getGroupByName(this.group_name).subscribe(data => {
      this.group = data[0];
      console.log(this.group);
    });
  }

  getGroupByName() {}

  // Remove a member from channel
  // function is called when "remove user" button
  // is clicked next to each member
  removeMember(membername: string, groupname: string, channelname: string) {
    if (
      confirm("Are you sure to remove " + membername + " from " + groupname)
    ) {
      this.loginService
        .removeUserChannel(membername, groupname, channelname)
        .subscribe(data => {
          // if the return data is false
          if (data == false) {
            alert("Cannot remove the group admin");
          } else {
            // reload the data
            this.loginService
              .getChannel(this.channel_name, this.group_name)
              .subscribe(data => {
                this.channelMembers = data.channel_members;
              });
            alert(membername + " has been removed from " + groupname);
          }
        });
    }
  }

  // function is called when 'remove channel' button
  // is clicked next to the channel name
  removeChannel(groupname: string, channelname: string) {
    if (confirm("Are you sure to remove " + channelname + " channel")) {
      this.loginService.removeChannel(groupname, channelname).subscribe();

      this.router.navigateByUrl("/account");
    }
  }

  // function is called when 'add' button
  // is clicked when the user name is specify
  addUserToChannel(groupname: string, channelname: string) {
    if (this.selectedUserChannel == "") {
      alert("Cannot be blank");
    } else {
      this.loginService
        .addUserToChannel(channelname, groupname, this.selectedUserChannel)
        .subscribe(data => {
          if (data == false) {
            alert("User already in " + channelname + " channel");
          } else {
            this.loginService
              .getChannel(this.channel_name, this.group_name)
              .subscribe(data => {
                this.channelMembers = data.channel_members;
              });

            this.selectedUserChannel = "";
            alert("Add user successfully");
          }
        });
    }
  }
}
