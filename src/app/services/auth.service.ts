import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'PATIENT' | 'DENTISTE' | 'ADMIN';
  token?: string;
  dateNaissanceP?: string; // For Patient
  photo?: string;
  sexe?: string;
}

export interface LoginResponse {
  message: string;
  sessionId: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private readonly USER_KEY = 'dentis_user';

  constructor(private apiService: ApiService, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const storedUser = sessionStorage.getItem(this.USER_KEY);
    if (storedUser) {
      try {
        this.userSubject.next(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user from storage', e);
        sessionStorage.removeItem(this.USER_KEY);
      }
    }
  }

  checkEmail(email: string): Observable<any> {
    return this.apiService.get(`/userREST/check-email/${email}`);
  }

  login(credentials: { email: string; motDePasse: string }): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('/userREST/login', credentials).pipe(
      tap(response => {
        if (response && response.user) {
          this.setUser(response.user);
        }
      })
    );
  }

  logout() {
    this.apiService.get('/userREST/logout').subscribe({
      next: () => this.clearUser(),
      error: () => this.clearUser() // Clear anyway
    });
  }

  private setUser(user: User) {
    this.userSubject.next(user);
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearUser() {
    this.userSubject.next(null);
    sessionStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/home']);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }
}
