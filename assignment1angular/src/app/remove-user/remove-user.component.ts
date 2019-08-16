import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginServiceService } from "../services/login-service.service";
import { HttpErrorResponse } from "@angular/common/http";
import { type } from "os";

@Component({
  selector: "app-remove-user",
  templateUrl: "./remove-user.component.html",
  styleUrls: ["./remove-user.component.css"]
})
export class RemoveUserComponent implements OnInit {
  users = [];

  constructor(
    private router: Router,
    private loginService: LoginServiceService
  ) {}

  ngOnInit() {
    this.loginService.retrieveUser().subscribe(data => {
      this.users = data;
    });
  }

  removeUser(email: string, type: number) {
    console.log(email);
    this.loginService.removeUser(email, type).subscribe(data => {
      if (data == true) {
        this.router.navigateByUrl("/account");
        alert(email + " is removed!!!");
      } else {
        alert("Cannot remove this user!!");
      }
    }),
      (error: HttpErrorResponse) => {
        alert("Error" + error);
      };
  }
}
