import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private emailSubject = new BehaviorSubject<string>('');
  email$ = this.emailSubject.asObservable();

  setEmail(email: string) {
    this.emailSubject.next(email);
  }

  getEmail(): string {
    return this.emailSubject.value;
  }
}
