import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface DentistSearchResult {
  id: number;
  nom: string;
  prenom: string;
  ville: string;
  photo?: string;
  diplome?: string;
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
    // Construct query parameters
    const params = new URLSearchParams();
    if (keyword) params.append('q', keyword);
    if (location) params.append('loc', location);

    const queryString = params.toString();
    const url = `/userREST/search/dentist?${queryString}`;

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
}
