import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { LoginServiceService } from "../services/login-service.service";

@Component({
  selector: "app-channel-details",
  templateUrl: "./channel-details.component.html",
  styleUrls: ["./channel-details.component.css"]
})
export class ChannelDetailsComponent implements OnInit {
  group_name;
  channel_name;
  channelMembers = [];

  constructor(
    private router: ActivatedRoute,
    private loginService: LoginServiceService
  ) {}

  ngOnInit() {
    this.router.params.subscribe((params: Params) => {
      this.group_name = params.gname;
      this.channel_name = params.cname; // (+) converts string 'id' to a number
    });
    this.loginService
      .getChannel(this.channel_name, this.group_name)
      .subscribe(data => {
        // console.log(data);
        this.channelMembers = data.channel_members;
        console.log(this.channelMembers);
      });
    // console.log(this.channel.channel_name);
  }

  getChannel() {}
}
