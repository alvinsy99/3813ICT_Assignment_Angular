import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginServiceService } from "../services/login-service.service";
import { saveAs } from "file-saver";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  emailRegister = "";
  usernameRegister = "";
  passwordRegister = "";
  groupadmin: boolean = false;
  superadmin: boolean = false;

  private data;

  constructor(
    private router: Router,
    private loginService: LoginServiceService
  ) {}

  ngOnInit() {}

  // Create new account
  createAccount() {
    if (
      this.emailRegister === "" ||
      this.usernameRegister === "" ||
      this.passwordRegister === ""
    ) {
      alert("Email, Username and Password cannot be blank");
    } else {
      this.loginService
        .createAccountService(
          this.emailRegister,
          this.usernameRegister,
          this.groupadmin,
          this.superadmin,
          this.passwordRegister
        )
        .subscribe(data => {
          console.log(data);
          if (data == false) {
            alert("Email or Username is already taken");
            this.emailRegister = "";
            this.usernameRegister = "";
            this.passwordRegister = "";
          } else {
            this.router.navigateByUrl("/remove_user");
            alert("User has been registered!!!");
          }
        });
    }

    // this.loginService.retrieveUser().subscribe(data => {
    //   saveAs(JSON.stringify(data), "valid_users.json");
    // });
  }
}
