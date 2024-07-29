import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, inject, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from "./app-routing.module";
import {ConfigService} from "config-lib";
import {Routes, ROUTES} from "@angular/router";
import {take, tap} from "rxjs";
import {loadRemoteModule} from "@angular-architects/module-federation";
import {LoadingService} from "./loading.service";
import {LoadingSpinnerComponent} from "./loading-spinner.component";
import {AuthService, provideAuth0} from "@auth0/auth0-angular";

// import { SharedLibModule } from 'projects/shared-lib/src/public-api';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    LoadingSpinnerComponent,
    HomeComponent,
    NotFoundComponent
  ],
  providers: [
    // provideAuth0({
    //   domain: 'firdausng.au.auth0.com',
    //   clientId: 'eUE8JCYqY68DBDH2mUJy9tyAV01tMzyU',
    //   authorizationParams: {
    //     redirect_uri: window.location.origin
    //   }
    // }),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        console.log('Shell App initializing...');
        const loadingService = inject(LoadingService);

        loadingService.setLoading(true);
        const configService = inject(ConfigService);
        return () => configService.fetchRoutesConfiguration().pipe(
          take(1),
          tap(routes => loadingService.setLoading(false))
        );
      },
      multi: true
    },
    {
      provide: ROUTES,
      useFactory: () => {
        console.log('Shell App ROUTES initializing...');
        const configService = inject(ConfigService);
        console.log(configService.routeConfigurations?.shellRoutes)
        const shellRoutes = configService.routeConfigurations.shellRoutes;

        const routes: Routes = [
          {
            path: '',
            component: HomeComponent,
            pathMatch: 'full',
          },
          {
            path: '**',
            component: NotFoundComponent
          }
        ];

        // Process serverRoutes (if needed)
        shellRoutes.forEach(route => {
          console.group('get route')
          console.log(route);
          console.log({
            type: 'module',
            remoteEntry: route.remoteEntry,
            exposedModule: route.exposedModule
          })

          console.groupEnd()
          // use unshift to add module in front of the array
          routes.unshift({
            path: route.path,
            loadChildren: () =>
              loadRemoteModule({
                type: 'module',
                remoteEntry: route.remoteEntry,
                exposedModule: route.exposedModule
              })
                .then(m => m[route.moduleName])
          }); // Push server routes into the main routes array
        })
        console.log(routes);

        return routes;
        //  const routes: Routes = [
        //    ...FLIGHTS_ROUTES,
        //    {
        //      path: 'test',
        //      component: FlightsSearchComponent
        //    }
        //  ];
        //  return routes;
      },
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
