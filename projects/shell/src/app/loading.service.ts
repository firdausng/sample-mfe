import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoading = new BehaviorSubject<boolean>(false);

  setLoading(loading: boolean) {
    this.isLoading.next(loading);
  }

  getLoading() {
    return this.isLoading.asObservable();
  }
}
