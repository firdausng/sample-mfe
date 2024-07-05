import {Component} from '@angular/core';
import {AuthLibService} from "auth-lib";

@Component({
  selector: 'app-flights-search',
  templateUrl: './flights-search.component.html'
})
export class FlightsSearchComponent {
  user = this.service.user;
  constructor(private service: AuthLibService) { }
}
