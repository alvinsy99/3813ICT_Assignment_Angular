import { TestBed } from "@angular/core/testing";

import { LoginServiceService } from "./login-service.service";

describe("LoginServiceService", () => {
  let loginService: LoginServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginServiceService]
    });

    loginService = TestBed.get(LoginServiceService);
  });

  it("should be created", () => {
    const service: LoginServiceService = TestBed.get(LoginServiceService);
    expect(loginService).toBeTruthy();
  });
});
