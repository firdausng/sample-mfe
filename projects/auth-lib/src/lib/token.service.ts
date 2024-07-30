import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {Observable, from, BehaviorSubject} from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  constructor(private auth: AuthService) {}

  initializeToken(): Promise<string | null> {
    return new Promise((resolve) => {
      this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          from(this.auth.getAccessTokenSilently()).pipe(
            tap(token => this.tokenSubject.next(token))
          ).subscribe({
            next: (token) => resolve(token),
            error: () => resolve(null)
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  getToken(): Observable<string | null> {
    return this.token$;
  }

  clearToken(): void {
    this.tokenSubject.next(null);
  }
}
