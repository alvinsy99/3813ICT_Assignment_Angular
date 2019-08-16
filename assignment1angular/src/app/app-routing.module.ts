import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AccountComponent } from "./account/account.component";
import { RegisterComponent } from "./register/register.component";
import { RemoveUserComponent } from "./remove-user/remove-user.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "account", component: AccountComponent },
  { path: "register", component: RegisterComponent },
  { path: "remove_user", component: RemoveUserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
