import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {loadRemoteModule} from "@angular-architects/module-federation";
import {ConfigService} from "config-lib";
import {FlightsSummaryComponent} from "../../../../mfe1/src/app/flight-summary/flights-summary.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  @ViewChild('placeHolder', { read: ViewContainerRef })
  viewContainer!: ViewContainerRef;

  constructor(private configService: ConfigService) {
  }

  ngOnInit() {
  }

  async load(): Promise<void> {

    const remoteComponent = this.configService.routeConfigurations.components[0];
    console.log(remoteComponent);
    const m = await loadRemoteModule({
      type: 'module',
      remoteEntry: remoteComponent.remoteEntry,
      exposedModule: remoteComponent.exposedModule
    });

    const ref = this.viewContainer.createComponent(m[remoteComponent.componentName]);
    // const compInstance = ref.instance;
    // compInstance.ngOnInit()
  }

}
