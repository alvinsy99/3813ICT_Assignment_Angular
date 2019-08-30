import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { LoginServiceService } from "../services/login-service.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-group",
  templateUrl: "./group.component.html",
  styleUrls: ["./group.component.css"]
})
export class GroupComponent implements OnInit {
  @Output() click = new EventEmitter();
  groupname = "";
  assist1 = "";
  assist2 = "";
  session = JSON.parse(sessionStorage.getItem("sessionUser"));
  groups = [];
  users = [];
  channelName = "";

  selectedUser = "";
  selectedGroup = "";
  selectedUserChannel = "";
  selectedChannel = "";

  constructor(
    private router: Router,
    private loginService: LoginServiceService
  ) {}

  ngOnInit() {
    console.log("FROM GROUP COMPONENT");
    this.click.emit();
    this.loginService.getGroups().subscribe(data => {
      this.groups = data;
      console.log(data);
    });

    this.loginService.retrieveUser().subscribe(data => {
      this.users = data;
    });

    console.log(this.session);
  }

  createGroup(groupadmin: string) {
    if (this.groupname !== "" && this.assist1 !== "") {
      if (this.assist1 == this.assist2) {
        alert("Assistances cannot be the same person");
      } else {
        this.loginService
          .createGroups(this.groupname, groupadmin, this.assist1, this.assist2)
          .subscribe(data => {
            console.log(data);
            if (data.confirm === false) {
              alert("Group name already exist");
              this.groupname = "";
            } else {
              this.loginService.getGroups().subscribe(data => {
                this.groups = data;
                console.log(data);
              });

              alert(this.groupname + " is successfully created");
              this.groupname = "";
              this.assist1 = "";
              this.assist2 = "";
            }
          });
      }
    } else {
      alert("Please check all the requiments");
    }
  }

  addMember(groupn: string) {
    // console.log(this.user_email);

    this.loginService.addMember(this.selectedUser, groupn).subscribe(data => {
      if (data.confirmation == false) {
        alert("User is already in that group");
      } else {
        this.loginService.getGroups().subscribe(data => {
          this.groups = data;
          console.log(data);
        });

        alert(this.selectedUser + " is added to " + groupn);
        this.selectedUser = "";
      }
    });
  }

  removeGroup(groupname: string) {
    if (confirm("Are you sure to delete " + groupname)) {
      this.loginService.removeGroup(groupname).subscribe();
      this.loginService.getGroups().subscribe(data => {
        this.groups = data;
        console.log(data);
      });
      alert(groupname + " has been removed");
    }
  }

  removeMember(membername: string, groupname: string) {
    if (
      confirm("Are you sure to remove " + membername + " from " + groupname)
    ) {
      this.loginService.removeMember(membername, groupname).subscribe(data => {
        if (data.confirmation == false) {
          alert("Cannot remove the group admin");
        } else {
          this.loginService.getGroups().subscribe(data => {
            this.groups = data;
            console.log(data);
          });
          alert(membername + " has been removed from " + groupname);
        }
      });
    }
  }

  createChannel(groupname: string, membername: string) {
    console.log(groupname);
    console.log(membername);

    this.loginService
      .createChannel(this.channelName, groupname, membername)
      .subscribe(data => {
        if (data.confirmation == false) {
          alert("Channel name existed");
        } else {
          this.loginService.getGroups().subscribe(data => {
            this.groups = data;
            console.log(data);
          });

          alert(this.channelName + "is created!!");
          this.channelName = "";
        }
      });
  }

  // addUserToChannel(groupname: string) {
  //   console.log(groupname);
  //   console.log(this.selectedChannel);
  //   console.log(this.selectedUserChannel);

  //   this.loginService
  //     .addUserToChannel(
  //       this.selectedChannel,
  //       groupname,
  //       this.selectedUserChannel
  //     )
  //     .subscribe(data => {
  //       if (data.confirmation == false) {
  //         alert("User already in " + this.selectedChannel + " channel");
  //       } else {
  //         this.loginService.getGroups().subscribe(data => {
  //           this.groups = data;
  //           console.log(data);
  //         });
  //         this.selectedChannel = "";
  //         this.selectedUserChannel = "";
  //         alert("Add user successfully");
  //       }
  //     });
  // }
}
