import {inject, Injectable} from '@angular/core';
import {Route, Router, Routes} from '@angular/router';
import {concatMap, delay, from, Observable, of, Subject, switchMap, tap} from "rxjs";
import {FLIGHTS_ROUTES} from "../../../mfe1/src/app/flights/flights.routes";
import {FlightsSearchComponent} from "../../../mfe1/src/app/flights/flights-search/flights-search.component";
import {AuthService} from "@auth0/auth0-angular";
import {NotFoundComponent} from "../../../shell/src/app/not-found/not-found.component";
import {authGuard} from "../../../shell/src/app/AuthGuard";
import {HomeComponent} from "../../../shell/src/app/home/home.component";
import {loadRemoteModule} from "@angular-architects/module-federation";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  // @ts-ignore
  routeConfigurations: AppConfiguration;

  private appConfigurationSource = new Subject<AppConfiguration| null>();
  appConfiguration$ = this.appConfigurationSource.asObservable();

  constructor(private authService: AuthService, private router: Router) {}

  fetchRoutesConfiguration(): Observable<AppConfiguration> {
    console.log('Fetching routes configuration...');
    return this.authService.isAuthenticated$.pipe(
      concatMap((x) => {
        if(!x){
          return this.authService.loginWithRedirect();
        }
        return this.authService.getAccessTokenSilently();
      }),
      switchMap((token) => {
        console.log('token', token);
        return of<AppConfiguration>(configuration).pipe(
          delay(1000),
          tap(x => {
            this.routeConfigurations = x;
            this.appConfigurationSource.next(x);
            console.log('this.routeConfigurations', this.routeConfigurations);

            console.log(this.routeConfigurations.shellRoutes)
            const shellRoutes = this.routeConfigurations.shellRoutes;

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
            console.log("routes", routes);
            this.router.resetConfig(routes);
          })
        )
      })
    )
  }

  updateNav(nav: NavItem){
    this.routeConfigurations.header.navList.push(nav);
    this.appConfigurationSource.next(this.routeConfigurations);
  }
}


export interface MfeRoute {
  path: string;
  remoteEntry: string;
  exposedModule: string;
  moduleName: string;
}

export interface MfeComponent {
  componentName: string;
  remoteEntry: string;
  exposedModule: string;
}


export interface AppConfiguration {
  shellRoutes: MfeRoute[],
  components: MfeComponent[],
  mfeRoutes: Record<string, Routes>,
  header: {
    navList: NavItem[]
  }
}

export interface NavItem{
  name:string,
  navLink: string
  children?: NavItem[]
}

const configuration: AppConfiguration = {
  shellRoutes: [
    {
      path: 'flights',
      remoteEntry: 'http://localhost:4203/remoteEntry.js',
      exposedModule: './flight',
      moduleName: 'FlightsModule'
    },
  ],
  components: [
    {
      componentName: 'FlightsSummaryComponent',
      remoteEntry: 'http://localhost:4203/remoteEntry.js',
      exposedModule: './flight-summary',
    },
  ],
  header: {
    navList: [
      {name: 'Home', navLink: '/'},
      {
        name: 'Flights',
        navLink: '/flights/flights-search'
      },
    ]
  },
  mfeRoutes: {
    'flights': [
      ...FLIGHTS_ROUTES,
      {
        path: 'test',
        component: getComponent('FlightsSearchComponent'),
      }
    ]
  }
};



export function routeSerializer(backendRoute: any): Route {
  return {
    path: backendRoute.path,
    component: getComponent(backendRoute.componentName),
    data: backendRoute.data
  };
}

function getComponent(componentName: string): any {
  // Map component names to actual component classes
  const componentMap: { [key: string]: any } = {
    'FlightsSearchComponent': FlightsSearchComponent,
    // Add more mappings as needed
  };
  return componentMap[componentName];
}
