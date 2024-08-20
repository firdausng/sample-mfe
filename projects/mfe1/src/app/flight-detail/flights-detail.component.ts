import {Component} from '@angular/core';
import {AuthLibService} from "auth-lib";

@Component({
  selector: 'app-flights-detail',
  standalone: true,
  templateUrl: './flights-detail.component.html'
})
export class FlightsDetailComponent {
  user = this.service.user;
  constructor(private service: AuthLibService) { }
}
