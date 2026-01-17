import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Horaire {
  idHoraire?: number;
  jourSemaine: 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI' | 'DIMANCHE';
  matinDebut?: string;
  matinFin?: string;
  apresMidiDebut?: string;
  apresMidiFin?: string;
  estFerme?: boolean;
}

export interface DentistSearchResult {
  id: number;
  nom: string;
  prenom: string;
  ville: string; // Mapped from delegation/gouvernorat for compatibility
  gouvernorat?: string;
  delegation?: string;
  adresse?: string;
  photo?: string | null;
  diplome?: string;
  specialite?: string;
  telephone?: string;
}

export interface SearchDropdownResponse {
  services: string[];
  dentistes: DentistSearchResult[];
}

@Injectable({
  providedIn: 'root'
})
export class DentistService {

  constructor(private apiService: ApiService) { }

  searchDentists(keyword: string, location: string): Observable<DentistSearchResult[]> {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('gouvernorat', location);

    const queryString = params.toString();
    const url = `/userREST/search?${queryString}`;

    return this.apiService.get<DentistSearchResult[]>(url);
  }

  getSearchDropdown(keyword: string): Observable<SearchDropdownResponse> {
    const params = new URLSearchParams();
    if (keyword) params.append('q', keyword);
    const url = `/userREST/search/dropdown?${params.toString()}`;
    return this.apiService.get<SearchDropdownResponse>(url);
  }

  getDentistById(id: number): Observable<DentistSearchResult> {
    return this.apiService.get<DentistSearchResult>(`/userREST/dentist/${id}`);
  }

  updateProfile(id: number, data: any): Observable<any> {
    return this.apiService.put(`/userREST/dentist/${id}`, data);
  }

  getHoraires(id: number): Observable<Horaire[]> {
    return this.apiService.get<Horaire[]>(`/userREST/dentist/${id}/horaires`);
  }

  updateHoraires(id: number, horaires: Horaire[]): Observable<any> {
    return this.apiService.put(`/userREST/dentist/${id}/horaires`, horaires);
  }
}
