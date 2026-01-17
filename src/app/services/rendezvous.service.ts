import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Rendezvous {
  idRv?: number;
  patientId: number;
  dentistId?: number;
  serviceId?: number;
  dateRv: string; // YYYY-MM-DD
  heureRv: string; // HH:mm
  statutRv?: 'DISPONIBLE' | 'NON_DISPONIBLE';
  descriptionRv: string;
  patientName?: string;
  dentistName?: string;
  serviceName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {

  constructor(private apiService: ApiService) { }

  bookAppointment(rendezvous: Rendezvous): Observable<Rendezvous> {
    return this.apiService.post<Rendezvous>('/rendezvous/', rendezvous);
  }

  getMyAppointments(): Observable<Rendezvous[]> {
    return this.apiService.get<Rendezvous[]>('/rendezvousREST/my');
  }

  addAvailableSlot(slot: { dateRv: string, heureRv: string, descriptionRv?: string }): Observable<any> {
    return this.apiService.post('/rendezvousREST/add', slot);
  }

  validateAppointment(id: number, status: 'VALIDATED' | 'REFUSED'): Observable<void> {
    return this.apiService.put<void>(`/rendezvous/${id}/validate?status=${status}`, {});
  }

  cancelAppointment(id: number): Observable<void> {
    return this.apiService.put<void>(`/rendezvous/${id}/cancel`, {}); // Using put to trigger cancellation as per instruction
  }
}
