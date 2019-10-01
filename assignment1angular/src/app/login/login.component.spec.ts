import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginComponent } from "./login.component";
import { Route, Router, Data } from "@angular/router";
import { LoginServiceService } from "../services/login-service.service";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule, BrowserModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", async(() => {
    expect(component).toBeTruthy();
  }));

  it("should have a title", async(() => {
    expect(component.title).toEqual("Assignment1angular");
  }));

  it("should render h3 title", async(() => {
    fixture.detectChanges();
    const compileComponents = fixture.debugElement.nativeElement;
    expect(compileComponents.querySelector("h3").textContent).toContain(
      "Sign In"
    );
  }));

  it("form should be valid", async(() => {
    component.email = "a-user@mail.com";
    component.password = "123a";
    expect();
  }));
});
