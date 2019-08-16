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

  createAccountService(email: string, password: string) {
    return this.http.post<User>(this.backend + "/api/register", {
      email: email,
      password: password
    });
  }

  retrieveUser() {
    return this.http.get<any>(this.backend + "/getusers");
  }

  removeUser(email: string, type: number) {
    return this.http.post<any>(this.backend + "/api/delete", {
      email: email,
      type: type
    });
  }
}
