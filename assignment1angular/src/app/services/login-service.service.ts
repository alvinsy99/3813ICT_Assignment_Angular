import { Injectable } from "@angular/core";
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

  constructor(private http: HttpClient) {}

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
    password: string
  ) {
    return this.http.post<User>(this.backend + "/api/register", {
      email: email,
      username: username,
      isGroupAdmin: isGroupAdmin,
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

  createGroups(groupname: string, assist1: string, assist2: string) {
    return this.http.post<any>(this.backend + "/groups", {
      groupname: groupname,
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
}
