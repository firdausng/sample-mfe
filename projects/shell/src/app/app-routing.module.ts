import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotFoundComponent} from "./not-found/not-found.component";
import {HomeComponent} from "./home/home.component";
import { loadRemoteModule } from '@angular-architects/module-federation';
import {ConfigService} from "config-lib";
// import { ModuleFederationTools } from '@angular-architects/module-federation-tools'; // Import ModuleFederationTools

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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private configService: ConfigService) { // Inject service for route data
    this.configService.fetchRoutes().subscribe(serverRoutes => {
      console.log(routes)
      // Process serverRoutes (if needed)
      serverRoutes.forEach(route => {
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

      RouterModule.forRoot(routes); // Re-configure router with updated routes
    });
  }
}
