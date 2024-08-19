import {Component} from '@angular/core';
import {AuthLibService} from "auth-lib";

@Component({
  selector: 'app-flights-search',
  standalone: true,
  templateUrl: './flights-summary.component.html'
})
export class FlightsSummaryComponent {
  user = this.service.user;
  constructor(private service: AuthLibService) { }
}
