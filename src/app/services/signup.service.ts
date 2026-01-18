import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface SignupData {
  role?: 'PATIENT' | 'DENTISTE';
  nom?: string;
  prenom?: string;
  email?: string;
  motDePasse?: string;
  tel?: number;
  sexe?: string;
  photo?: string; // base64
  
  // Patient specific
  dateNaissanceP?: string;
  groupeSanguinP?: string;
  recouvrementP?: string;

  // Dentist specific
  gouvernorat?: string;
  adresse?: string;
  specialite?: string;
  diplome?: string; // base64
  delegation?: string;
  localite?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private signupDataSubject = new BehaviorSubject<SignupData>({});
  
  constructor(private apiService: ApiService) {}

  updateData(data: Partial<SignupData>) {
    const current = this.signupDataSubject.value;
    this.signupDataSubject.next({ ...current, ...data });
  }

  getData(): SignupData {
    return this.signupDataSubject.value;
  }
  
  // Helper for single email field used in signin/signup flows
  setEmail(email: string) {
    this.updateData({ email });
  }

  getEmail(): string {
    return this.getData().email || '';
  }

  getRole(): 'PATIENT' | 'DENTISTE' {
    return this.getData().role || 'PATIENT'; // Default to Patient if not set
  }

  registerPatient(): Observable<any> {
    const data = this.getData();
    // Ensure all required fields for patient are present
    const payload = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      motDePasse: data.motDePasse,
      tel: data.tel,
      sexe: data.sexe,
      photo: data.photo,
      dateNaissanceP: data.dateNaissanceP,
      groupeSanguinP: data.groupeSanguinP,
      recouvrementP: data.recouvrementP
    };
    return this.apiService.post('/userREST/signup/patient', payload);
  }

  registerDentist(): Observable<any> {
    const data = this.getData();
    // Ensure all required fields for dentist are present
    const payload = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      motDePasse: data.motDePasse,
      tel: data.tel,
      sexe: data.sexe,
      photo: data.photo,
      gouvernorat: data.gouvernorat,
      delegation: data.delegation,
      adresse: data.adresse,
      specialite: data.specialite,
      diplome: data.diplome
    };
    console.log('Registering dentist with payload:', payload); // Debug
    return this.apiService.post('/userREST/signup/dentist', payload);
  }
}
