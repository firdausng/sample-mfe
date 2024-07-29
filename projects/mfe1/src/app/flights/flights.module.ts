import {APP_INITIALIZER, ENVIRONMENT_INITIALIZER, inject, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightsSearchComponent } from './flights-search/flights-search.component';
import {RouterModule, Routes, Router, ROUTES} from '@angular/router';
import {ConfigService} from "config-lib";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([])
  ],
  declarations: [
    FlightsSearchComponent
  ],
  providers: [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () =>{
        console.log('[ENVIRONMENT_INITIALIZER] MFE App initializing...');
      }
    },
    {
      provide: ROUTES,
      useFactory:  () => {
        console.log('[ROUTES] MFE App ROUTES initializing...');
       const configService = inject(ConfigService);

        configService.updateNav({
          name: 'Test',
          navLink: '/flights/test',
          // permissions: ['onehub-test']
        });

       return configService.routeConfigurations?.mfeRoutes['flights'];
      },
      deps: [],
      multi: true
    }
  ],
})
export class FlightsModule {}
