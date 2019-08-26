import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"]
})
export class AccountComponent implements OnInit {
  protected user;

  constructor() {}

  ngOnInit() {
    if (typeof Storage !== "undefined") {
      this.user = JSON.parse(sessionStorage.getItem("sessionUser"));
    }
  }
}
