import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface PublicationDTO {
  idPub?: number;
  id?: number; // Backend might send 'id' or 'idPub'
  titrePub: string;
  typePub: string;
  description: string;
  fichierPub?: string; // Base64
  affichePub?: string; // Base64
  dentistId?: number;
  dentistName?: string;
  valide?: boolean;
  datePub?: any;
}



@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  constructor(private apiService: ApiService) {}

  addPublication(publication: PublicationDTO): Observable<any> {
    return this.apiService.post('/publicationRest/add', publication);
  }

  getAllValidPublications(): Observable<PublicationDTO[]> {
    return this.apiService.get<PublicationDTO[]>('/publicationRest/publications');
  }

  getPendingPublications(): Observable<PublicationDTO[]> {
    return this.apiService.get<PublicationDTO[]>('/publicationRest/pending');
  }

  getMyPublications(): Observable<PublicationDTO[]> {
    return this.apiService.get<PublicationDTO[]>('/publicationRest/my');
  }

  updatePublication(id: number, publication: PublicationDTO): Observable<any> {
    return this.apiService.put(`/publicationRest/${id}`, publication);
  }

  validatePublication(id: number): Observable<any> {
    return this.apiService.put(`/publicationRest/${id}/validate`, {});
  }

  invalidatePublication(id: number): Observable<any> {
    return this.apiService.put(`/publicationRest/${id}/invalidate`, {});
  }

  deletePublication(id: number): Observable<any> {
    return this.apiService.delete(`/publicationRest/${id}`);
  }

}

