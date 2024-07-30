import { Component } from '@angular/core';
import {AuthLibService} from "auth-lib";
import {ConfigService} from "config-lib";
import {AuthService} from "@auth0/auth0-angular";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'shell';

  constructor(private service: AuthLibService, public configService: ConfigService, public auth: AuthService) {
    this.service.login('Max', '');
  }
}

