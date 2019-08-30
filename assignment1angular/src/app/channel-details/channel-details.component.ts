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
    this.activatedroute.params.subscribe((params: Params) => {
      this.group_name = params.gname;
      this.channel_name = params.cname; // (+) converts string 'id' to a number
    });
    this.loginService
      .getChannel(this.channel_name, this.group_name)
      .subscribe(data => {
        this.channelMembers = data.channel_members;
      });
    this.loginService.getGroupByName(this.group_name).subscribe(data => {
      this.group = data;
      console.log(this.group.group_admin);
    });

    // console.log(this.channel.channel_name);
  }

  getGroupByName() {}

  removeMember(membername: string, groupname: string, channelname: string) {
    if (
      confirm("Are you sure to remove " + membername + " from " + groupname)
    ) {
      this.loginService
        .removeUserChannel(membername, groupname, channelname)
        .subscribe(data => {
          if (data.confirmation == false) {
            alert("Cannot remove the group admin");
          } else {
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

  removeChannel(groupname: string, channelname: string) {
    if (confirm("Are you sure to remove " + channelname + " channel")) {
      this.loginService.removeChannel(groupname, channelname).subscribe();

      this.router.navigateByUrl("/account");
    }
  }

  addUserToChannel(groupname: string, channelname: string) {
    this.loginService
      .addUserToChannel(channelname, groupname, this.selectedUserChannel)
      .subscribe(data => {
        if (data.confirmation == false) {
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