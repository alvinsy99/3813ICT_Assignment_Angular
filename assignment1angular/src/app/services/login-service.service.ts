import { Injectable, Output, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";

interface User {
  email: string;
  type: number;
  valid: boolean;
}

@Injectable({
  providedIn: "root"
})
export class LoginServiceService {
  backend = "http://localhost:3000";
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  constructor(private http: HttpClient) {}
  successlogin(email: string, password: string) {
    if (this.logIn(email, password)) {
      this.getLoggedInName.emit(email);
      return true;
    } else {
      this.getLoggedInName.emit("Log In");
      return false;
    }
  }
  logIn(email: string, password: string) {
    return this.http.post<User>(this.backend + "/api/auth", {
      email: email,
      password: password
    });
  }

  createAccountService(
    email: string,
    username: string,
    isGroupAdmin: boolean,
    isSuperAdmin: boolean,
    password: string
  ) {
    return this.http.post<User>(this.backend + "/api/register", {
      email: email,
      username: username,
      isGroupAdmin: isGroupAdmin,
      isSuperAdmin: isSuperAdmin,
      password: password
    });
  }

  retrieveUser() {
    return this.http.get<any>(this.backend + "/getusers");
  }

  removeUser(email: string) {
    return this.http.post<any>(this.backend + "/api/delete", {
      email: email
    });
  }

  getGroups() {
    return this.http.get<any>(this.backend + "/groups");
  }

  createGroups(
    groupname: string,
    groupadmin: string,
    assist1: string,
    assist2: string
  ) {
    return this.http.post<any>(this.backend + "/groups", {
      groupname: groupname,
      groupadmin: groupadmin,
      assist1: assist1,
      assist2: assist2
    });
  }

  addMember(username: string, groupname: string) {
    return this.http.post<any>(this.backend + "/addmember", {
      username: username,
      groupname: groupname
    });
  }

  removeGroup(groupname: string) {
    return this.http.post<any>(this.backend + "/removegroup", {
      groupname: groupname
    });
  }

  removeMember(membername: string, groupname: string) {
    return this.http.post<any>(this.backend + "/removemember", {
      membername: membername,
      groupname: groupname
    });
  }

  createChannel(channelname: string, groupname: string, member: string) {
    return this.http.post<any>(this.backend + "/channels", {
      channelname: channelname,
      groupname: groupname,
      member: member
    });
  }

  addUserToChannel(channelname: string, groupname: string, member: string) {
    return this.http.post<any>(this.backend + "/addUserToChannel", {
      channelname: channelname,
      groupname: groupname,
      member: member
    });
  }

  getChannel(channelname: string, groupname: string) {
    return this.http.post<any>(this.backend + "/channel", {
      channelname: channelname,
      groupname: groupname
    });
  }

  getGroupByName(groupname: string) {
    return this.http.post<any>(this.backend + "/getgroupbyname", {
      groupname: groupname
    });
  }

  removeUserChannel(member: string, groupname: string, channelname: string) {
    return this.http.post<any>(this.backend + "/removeuserchannel", {
      member: member,
      groupname: groupname,
      channelname: channelname
    });
  }

  removeChannel(groupname: string, channelname: string) {
    return this.http.post<any>(this.backend + "/removechannel", {
      groupname: groupname,
      channelname: channelname
    });
  }

  grandSuper(email: string) {
    return this.http.post<any>(this.backend + "/grandsuper", {
      email: email
    });
  }
}
