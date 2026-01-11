import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface ServiceMedical {
  numSM?: number;
  nomSM: string;
  typeSM: string;
  descriptionSM: string;
  tarifSM: number;
  image: string; // base64
  dentistId?: number; // Optional, set by backend or frontend
}

@Injectable({
  providedIn: 'root'
})
export class ServiceMedicalService {

  constructor(private apiService: ApiService) { }

  getAllServices(): Observable<ServiceMedical[]> {
    return this.apiService.get<ServiceMedical[]>('/services/');
  }

  getMyServices(): Observable<ServiceMedical[]> {
    return this.apiService.get<ServiceMedical[]>('/services/dentist/me');
  }

  createService(service: ServiceMedical): Observable<ServiceMedical> {
    return this.apiService.post<ServiceMedical>('/services/', service);
  }

  updateService(id: number, service: ServiceMedical): Observable<ServiceMedical> {
    return this.apiService.put<ServiceMedical>(`/services/${id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.apiService.delete<void>(`/services/${id}`);
  }
}
