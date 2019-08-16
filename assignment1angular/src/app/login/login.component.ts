import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Route, Router, Data } from "@angular/router";
import { LoginServiceService } from "../services/login-service.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  email = "";
  password = "";
  title = "Login";

  constructor(
    private router: Router,
    private loginService: LoginServiceService
  ) {}

  ngOnInit() {}

  logIn() {
    console.log(this.email);
    console.log(this.password);

    this.loginService.logIn(this.email, this.password).subscribe(data => {
      var dataJSON = JSON.stringify(data);
      var dataEmailJSON = JSON.stringify(data.email);

      if (data.valid == true) {
        sessionStorage.setItem("sessionUser", dataJSON);
        localStorage.setItem("localUser", dataEmailJSON);
        this.router.navigateByUrl("/account");
      } else {
        alert("Invalid username or password");
        this.email = "";
        this.password = "";
      }
    }),
      (error: HttpErrorResponse) => {
        alert("Error: " + error);
      };
  }
}
