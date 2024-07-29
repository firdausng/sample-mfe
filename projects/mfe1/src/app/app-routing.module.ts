import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ConfigService} from "config-lib";
import {loadRemoteModule} from "@angular-architects/module-federation";

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private configService: ConfigService) { // Inject service for route data
    this.configService.fetchRoutesConfiguration().subscribe(serverRoutes => {
      console.log(routes)
      RouterModule.forRoot(serverRoutes.mfeRoutes['flight']); // Re-configure router with updated routes
    });
  }
}
