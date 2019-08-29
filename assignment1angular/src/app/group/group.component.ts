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
  assist1 = "";
  assist2 = "";
  session = JSON.parse(sessionStorage.getItem("sessionUser"));
  groups = [];
  users = [];

  selectedUser = "";
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
              alert(this.groupname + " is successfully created");
              this.router.navigateByUrl("/account");
            }
          });
      }
    } else {
      alert("Please check all the requiments");
    }
  }

  addMember(groupn: string) {
    // console.log(this.user_email);
    console.log(this.selectedUser);
    console.log(this.selectedGroup);

    this.loginService.addMember(this.selectedUser, groupn).subscribe(data => {
      if (data.confirmation == false) {
        alert("User is already in that group");
      } else {
        alert(this.selectedUser + " is added to " + this.selectedGroup);
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
