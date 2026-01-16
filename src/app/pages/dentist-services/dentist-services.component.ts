import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceMedical, ServiceMedicalService } from '../../services/service-medical.service';
import { AddServiceModalComponent } from '../../components/add-service-modal/add-service-modal.component';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';

@Component({
  selector: 'app-dentist-services',
  standalone: true,
  imports: [CommonModule, AddServiceModalComponent, ServiceCardComponent],
  templateUrl: './dentist-services.component.html',
  styleUrls: ['./dentist-services.component.scss']
})
export class DentistServicesComponent implements OnInit {
  services: ServiceMedical[] = [];
  showAddModal = false;

  constructor(private serviceMedicalService: ServiceMedicalService) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    // In a real app, this would fetch from API
    // this.serviceMedicalService.getMyServices().subscribe(data => this.services = data);
    
    // Using mock data for now as per likely current state
    /*
    this.services = [
        {
            nomSM: 'Détartrage',
            typeSM: 'Soins dentaires',
            descriptionSM: 'Nettoyage complet des dents pour enlever le tartre.',
            tarifSM: 80,
            image: ''
        },
        {
            nomSM: 'Blanchiment',
            typeSM: 'Esthétique',
            descriptionSM: 'Éclaircissement des dents pour un sourire éclatant.',
            tarifSM: 400,
            image: ''
        }
    ];
    */
  }

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  onAddService(newService: ServiceMedical) {
    // Add logic to save via service
    console.log('Adding service:', newService);
    // Optimistic update
    this.services.unshift(newService);
    
    this.closeAddModal();
    
    // Call API
    // this.serviceMedicalService.createService(newService).subscribe(...);
  }
}
