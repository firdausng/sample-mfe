import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {AsyncPipe, DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-auth-button',
  template: `

    @if(auth.isAuthenticated$ | async){
      <button (click)="auth.logout({ logoutParams: { returnTo: document.location.origin } })">
        Log out
      </button>
    } @else {
      <button (click)="auth.loginWithRedirect()">Log in</button>
    }
<!--    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">-->
<!--      <button (click)="auth.logout({ logoutParams: { returnTo: document.location.origin } })">-->
<!--        Log out-->
<!--      </button>-->
<!--    </ng-container>-->

<!--    <ng-template #loggedOut>-->
<!--      <button (click)="auth.loginWithRedirect()">Log in</button>-->
<!--    </ng-template>-->
  `,
  imports: [
    AsyncPipe
  ],
  standalone: true
})
export class AuthButtonComponent {
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}
}
