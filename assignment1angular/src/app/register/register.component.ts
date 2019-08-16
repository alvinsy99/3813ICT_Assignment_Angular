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
  passwordRegister = "";

  private data;

  constructor(
    private router: Router,
    private loginService: LoginServiceService
  ) {}

  ngOnInit() {}

  createAccount() {
    console.log(this.emailRegister);
    console.log(this.passwordRegister);

    this.loginService
      .createAccountService(this.emailRegister, this.passwordRegister)
      .subscribe(data => {
        if (data.valid == false) {
          alert("Email is already taken");
          this.emailRegister = "";
          this.passwordRegister = "";
        } else {
          this.router.navigateByUrl("/account");
          alert("Email has been registered!!!");
        }
      });

    // this.loginService.retrieveUser().subscribe(data => {
    //   saveAs(JSON.stringify(data), "valid_users.json");
    // });
  }
}
