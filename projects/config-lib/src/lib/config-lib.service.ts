import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {from, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) { }

  fetchRoutes(): Observable<Routes[]> {
    // return this.http.get<Routes[]>('/api/routes'); // Replace with your API
    return of<Routes[]>([
      {
        path: 'flights',
        remoteEntry: 'http://localhost:4203/remoteEntry.js',
        exposedModule: './Module',
        moduleName: 'FlightsModule'
      }
    ])
  }

  fetchHeaderConfiguration(){

  }
}


interface Routes {
  path: string;
  remoteEntry: string;
  exposedModule: string;
  moduleName: string;
}
