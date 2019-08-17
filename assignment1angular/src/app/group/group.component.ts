import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginServiceService } from "../services/login-service.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-group",
  templateUrl: "./group.component.html",
  styleUrls: ["./group.component.css"]
})
export class GroupComponent implements OnInit {
  groupname = "";
  email = JSON.parse(sessionStorage.getItem("sessionUser")).email;
  groups = [];
  users = [];

  selectedEmail = "";
  selectedGroup = "";

  constructor(
    private router: Router,
    private loginService: LoginServiceService
  ) {}

  ngOnInit() {
    console.log("FROM GROUP COMPONENT");
    this.loginService.getGroups().subscribe(data => {
      this.groups = data;
      console.log(data);
    });

    this.loginService.retrieveUser().subscribe(data => {
      this.users = data;
    });
  }

  createGroup() {
    if (this.groupname !== "") {
      this.loginService
        .createGroups(this.email, this.groupname)
        .subscribe(data => {
          console.log(data);
          if (data.confirm == false) {
            alert("Group name already exist");
            this.groupname = "";
          } else {
            alert(this.groupname + " is successfully created");
            this.router.navigateByUrl("/account");
          }
        });
    } else {
      alert("Need to have a name!!");
    }
  }

  addMember() {
    // console.log(this.user_email);
    console.log(this.selectedEmail);
    console.log(this.selectedGroup);

    this.loginService
      .addMember(this.selectedEmail, this.selectedGroup)
      .subscribe(data => {
        if (data.confirmation == false) {
          alert("User is already in that group");
        } else {
          alert(this.selectedEmail + " is added to " + this.selectedGroup);
          this.router.navigateByUrl("/account");
        }
      });
  }

  removeGroup(groupname: string) {
    if (confirm("Are you sure to delete " + groupname)) {
      this.loginService.removeGroup(groupname).subscribe();
      alert(groupname + " has been removed");
      this.router.navigateByUrl("/account");
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
          alert(membername + " has been removed from " + groupname);
          this.router.navigateByUrl("/account");
        }
      });
    }
  }
}
