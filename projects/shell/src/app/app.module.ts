import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, inject, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ConfigService} from "config-lib";
import {Route, Router, RouterModule, Routes, ROUTES} from "@angular/router";
import { take} from "rxjs";
import {loadRemoteModule} from "@angular-architects/module-federation";
import {AuthService, provideAuth0} from "@auth0/auth0-angular";
import {authGuard} from "./AuthGuard";

// import { SharedLibModule } from 'projects/shared-lib/src/public-api';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([]),
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent
  ],
  providers: [
    provideAuth0({
      domain: 'firdausng.au.auth0.com',
      clientId: 'eUE8JCYqY68DBDH2mUJy9tyAV01tMzyU',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        console.log('Shell App initializing...');

        const router = inject(Router);
        // const authService = inject(AuthService);
        // const injector = inject(Injector);
        // const auth = injector.get(AuthService);

        const configService = inject(ConfigService);
        return () => configService.fetchRoutesConfiguration().pipe(
          take(1),
        );
      },
      deps:[AuthService],
      multi: true
    },
    {
      // provide: ROUTES,
      provide: "abc",
      useFactory: () => {
        console.log('Shell App ROUTES initializing...');
        const configService = inject(ConfigService);
        console.log(configService.routeConfigurations?.shellRoutes)
        const shellRoutes = configService.routeConfigurations.shellRoutes;

        const routes: Routes = [
          {
            path: '**',
            component: NotFoundComponent
          }
        ];

        const protectedRoutes: Route = {
          path: '',
          canActivate: [authGuard],
          children: [
            {
              path: '',
              component: HomeComponent,
              pathMatch: 'full',
            }
          ]
        };

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
          // routes.unshift({
          //   path: route.path,
          //   loadChildren: () =>
          //     loadRemoteModule({
          //       type: 'module',
          //       remoteEntry: route.remoteEntry,
          //       exposedModule: route.exposedModule
          //     })
          //       .then(m => m[route.moduleName])
          // }); // Push server routes into the main routes array

          protectedRoutes.children?.push({
            path: route.path,
            loadChildren: () =>
              loadRemoteModule({
                type: 'module',
                remoteEntry: route.remoteEntry,
                exposedModule: route.exposedModule
              })
                .then(m => m[route.moduleName])
          });

        })

        routes.unshift(protectedRoutes);

        console.log(routes);

        return routes;
      },
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
