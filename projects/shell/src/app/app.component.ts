import { Component } from '@angular/core';
import {AuthLibService} from "auth-lib";
import {ConfigService} from "config-lib";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'shell';

  constructor(private service: AuthLibService, public configService: ConfigService) {
    this.service.login('Max', '');
  }
}

