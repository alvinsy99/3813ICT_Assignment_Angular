import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginServiceService } from "../services/login-service.service";
import { HttpErrorResponse } from "@angular/common/http";

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

  removeUser(email: string) {
    console.log(email);
    if (email !== "a-user@mail.com") {
      this.loginService.removeUser(email).subscribe(data => {
        // this.router.navigateByUrl("/account");
        alert(email + " is removed!!!");
        this.loginService.retrieveUser().subscribe(data => {
          this.users = data;
        });
      }),
        (error: HttpErrorResponse) => {
          alert("Error" + error);
        };
    } else {
      alert("Cannot remove super admin");
    }
  }
}
