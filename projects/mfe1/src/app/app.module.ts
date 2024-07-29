import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, inject, NgModule} from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FlightsModule } from './flights/flights.module';
import { HttpClientModule } from '@angular/common/http';
import {AppRoutingModule} from "./app-routing.module";
import {ConfigService} from "config-lib";
import {take, tap} from "rxjs";
import {Routes, ROUTES} from "@angular/router";
import {NotFoundComponent} from "../../../shell/src/app/not-found/not-found.component";
import {loadRemoteModule} from "@angular-architects/module-federation";

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FlightsModule,
    AppRoutingModule
  ],
  declarations: [
    HomeComponent,
    AppComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        console.log('[APP_INITIALIZER]Flight MFE App initializing...');
        const configService = inject(ConfigService);
        return () => configService.fetchRoutesConfiguration().pipe(
          take(1),
        );
      },
      multi: true
    },
    {
      provide: ROUTES,
      useFactory: () => {
        console.log('[ROUTES] Flight MFE App ROUTES initializing...');
        const configService = inject(ConfigService);
        console.log(configService.routeConfigurations?.mfeRoutes['flights'])
        const flightRoutes = configService.routeConfigurations?.mfeRoutes['flights'];

        const routes: Routes = [];

        return flightRoutes;
      },
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
