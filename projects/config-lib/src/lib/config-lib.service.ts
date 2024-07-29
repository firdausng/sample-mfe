import { Injectable } from '@angular/core';
import {Route, Routes} from '@angular/router';
import {delay, from, Observable, of, Subject, tap} from "rxjs";
import {FLIGHTS_ROUTES} from "../../../mfe1/src/app/flights/flights.routes";
import {FlightsSearchComponent} from "../../../mfe1/src/app/flights/flights-search/flights-search.component";
import {AuthService} from "@auth0/auth0-angular";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  // @ts-ignore
  routeConfigurations: AppConfiguration;

  private appConfigurationSource = new Subject<AppConfiguration| null>();
  appConfiguration$ = this.appConfigurationSource.asObservable();

  fetchRoutesConfiguration(): Observable<AppConfiguration> {
    // this.authService.isAuthenticated$.pipe(
    //   tap((x) => {
    //     if(!x){
    //       this.authService.loginWithRedirect();
    //     }
    //   })
    // );
    return of<AppConfiguration>(configuration).pipe(
      delay(1000),
      tap(x => {
        this.routeConfigurations = x;
        this.appConfigurationSource.next(x);
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


export interface AppConfiguration {
  shellRoutes: MfeRoute[],
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
      exposedModule: './Module',
      moduleName: 'FlightsModule'
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
