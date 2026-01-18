import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { ServiceMedical } from './service-medical.service';
import { PublicationDTO } from './publication.service';
import { Horaire } from './dentist.service';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'PATIENT' | 'DENTISTE' | 'ADMIN';
  token?: string; // JWT
  tel?: number;
  sexe?: 'M' | 'F'; 
  photo?: string;

  // Patient
  dateNaissanceP?: string;
  groupeSanguinP?: string; // 'A', 'B', 'AB', 'O'
  recouvrementP?: string; // 'Médecin de la famille', etc.

  // Dentiste
  diplome?: string;
  specialite?: string;
  gouvernorat?: string;
  delegation?: string;
  adresse?: string;
  verifie?: boolean;
  services?: ServiceMedical[]; 
  publications?: PublicationDTO[]; 
  horaires?: Horaire[];

  // Admin
  adminType?: string;
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

  public clearUser() {
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

  getAllUsers(): Observable<User[]> {
      return this.apiService.get<User[]>('/userREST/users');
  }

  getUserById(id: number): Observable<User> {
      return this.apiService.get<User>(`/userREST/user/${id}`);
  }

  updateUser(id: number, userData: any): Observable<any> {
    // Backend endpoint: @PUT @Path("/user/{id}") within /userREST
    return this.apiService.put<any>(`/userREST/user/${id}`, userData).pipe(
        tap(() => {
            const currentUser = this.getUser();
            if (currentUser && currentUser.id === id) {
               // Update local state with the data we just sent
               const newUser = { ...currentUser, ...userData };
               // Ensure mapping back to internal property names if needed
               if (userData.dateNaissance) newUser.dateNaissanceP = userData.dateNaissance;
               if (userData.groupeSanguin) newUser.groupeSanguinP = userData.groupeSanguin;
               if (userData.recouvrement) newUser.recouvrementP = userData.recouvrement;
               
               this.setUser(newUser);
            }
        })
    );
  }

  deleteUser(id: number): Observable<void> {
      return this.apiService.delete<void>(`/userREST/user/${id}`);
  }

  /*
  validateDentist(id: number): Observable<void> {
      return this.apiService.put<void>(`/userREST/dentist/${id}/validate`, {});
  }
  */
}
