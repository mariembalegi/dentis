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
  selectedService: ServiceMedical | null = null;

  constructor(private serviceMedicalService: ServiceMedicalService) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    console.log('Fetching services...');
    this.serviceMedicalService.getAllServices().subscribe({
      next: (data) => {
        console.log('Services loaded from API:', data);
        this.services = data || [];
      },
      error: (err) => {
        console.error('Error loading services', err);
      }
    });
  }

  openAddModal() {
    this.selectedService = null;
    this.showAddModal = true;
  }

  openEditModal(service: ServiceMedical) {
    this.selectedService = service;
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.selectedService = null;
  }

  onAddService(newService: ServiceMedical) {
    console.log('Sending new service to API:', newService);
    this.serviceMedicalService.createService(newService).subscribe({
      next: (response: any) => {
        console.log('Service added successfully, response:', response);
        // Assign ID returned by backend
        newService.numSM = response.id;
        
        // Update local list (immutable update to ensure change detection)
        this.services = [newService, ...this.services];
        console.log('Local services list updated:', this.services);
        
        this.closeAddModal();
      },
      error: (err) => {
        console.error('Error adding service', err);
      }
    });
  }

  onUpdateService(updatedService: ServiceMedical) {
      if (!updatedService.numSM) return;
      
      this.serviceMedicalService.updateService(updatedService.numSM, updatedService).subscribe({
          next: (response) => {
              // Update local list
              const index = this.services.findIndex(s => s.numSM === updatedService.numSM);
              if (index !== -1) {
                  this.services[index] = updatedService;
              }
              this.closeAddModal();
          },
          error: (err) => console.error('Error updating service', err)
      });
  }

  onDeleteService(id: number) {
      if(confirm('Voulez-vous vraiment supprimer ce service ?')) {
          this.serviceMedicalService.deleteService(id).subscribe({
              next: () => {
                  this.services = this.services.filter(s => s.numSM !== id);
              },
              error: (err) => console.error('Error deleting service', err)
          });
      }
  }
}
