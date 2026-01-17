import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface PublicationDTO {
  idPub?: number;
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


}

