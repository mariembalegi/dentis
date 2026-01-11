import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { ServiceMedicalService, ServiceMedical } from '../../services/service-medical.service';
import { RendezvousService, Rendezvous } from '../../services/rendezvous.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  user: User | null = null;
  services: ServiceMedical[] = [];
  appointments: Rendezvous[] = [];
  
  // For Patient Booking
  selectedService: ServiceMedical | null = null;
  showServiceSelection = false;
  bookingDate: string = '';
  bookingTime: string = '';
  bookingReason: string = '';
  
  // For Dentist Service Creation
  newService: Partial<ServiceMedical> = {};
  showCreateServiceModule = false;

  // Search Terms
  serviceSearch: string = '';
  appointmentSearch: string = '';

  constructor(
    private authService: AuthService,
    private medicalService: ServiceMedicalService,
    private rendezvousService: RendezvousService,
    private router: Router
  ) {}

  get filteredServices(): ServiceMedical[] {
    if (!this.serviceSearch.trim()) return this.services;
    const term = this.serviceSearch.toLowerCase();
    return this.services.filter(s => 
      s.nomSM?.toLowerCase().includes(term) || 
      s.descriptionSM?.toLowerCase().includes(term)
    );
  }

  get filteredAppointments(): Rendezvous[] {
    if (!this.appointmentSearch.trim()) return this.appointments;
    const term = this.appointmentSearch.toLowerCase();
    return this.appointments.filter(rv => 
      rv.patientName?.toLowerCase().includes(term) ||
      rv.dateRv?.includes(term) ||
      rv.statutRv?.toLowerCase().includes(term)
    );
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadData();
  }

  loadData() {
    if (!this.user) return;

    if (this.user.role === 'PATIENT') {
      this.loadPatientData();
    } else if (this.user.role === 'DENTISTE') {
      this.loadDentistData();
    }
  }

  loadPatientData() {
    this.medicalService.getAllServices().subscribe(res => this.services = res);
    this.rendezvousService.getMyAppointments().subscribe(res => this.appointments = res);
  }

  loadDentistData() {
    this.medicalService.getMyServices().subscribe(res => this.services = res);
    this.rendezvousService.getMyAppointments().subscribe(res => this.appointments = res);
  }

  // Patient Actions
  initiateBooking(service: ServiceMedical) {
    this.selectedService = service;
  }

  confirmBooking() {
    if (!this.user || !this.selectedService) return;
    
    // Validate inputs
    if (!this.bookingDate || !this.bookingTime) {
      alert('Veuillez sélectionner une date et une heure');
      return;
    }

    const rv: Rendezvous = {
      patientId: this.user.id,
      dentistId: this.selectedService.dentistId!,
      serviceId: this.selectedService.numSM,
      dateRv: this.bookingDate,
      heureRv: this.bookingTime.length === 5 ? this.bookingTime + ':00' : this.bookingTime,
      descriptionRv: this.bookingReason || 'Réservation via Dashboard'
    };

    this.rendezvousService.bookAppointment(rv).subscribe({
      next: () => {
        alert('Rendez-vous demandé !');
        this.selectedService = null;
        this.loadPatientData();
      },
      error: (err) => alert('Erreur lors de la réservation')
    });
  }

  cancelBooking(id: number) {
    if(confirm('Annuler ce rendez-vous ?')) {
      this.rendezvousService.cancelAppointment(id).subscribe(() => this.loadData());
    }
  }

  // Dentist Actions
  validateRendezvous(id: number, status: 'VALIDATED' | 'REFUSED') {
    this.rendezvousService.validateAppointment(id, status).subscribe(() => this.loadData());
  }

  toggleCreateService() {
    this.showCreateServiceModule = !this.showCreateServiceModule;
  }

  submitNewService() {
    if (!this.newService.nomSM || !this.newService.tarifSM) return;
    
    // Need dentist ID? usually handled by backend via session or user object
    if (this.user) {
        this.newService.dentistId = this.user.id;
    }

    this.medicalService.createService(this.newService as ServiceMedical).subscribe({
      next: () => {
        this.showCreateServiceModule = false;
        this.newService = {};
        this.loadDentistData();
      },
      error: () => alert('Erreur création service')
    });
  }
  
  deleteService(id: number) {
     if(confirm('Supprimer ce service ?')) {
         this.medicalService.deleteService(id).subscribe(() => this.loadDentistData());
     }
  }

  goToHome() {
    if (this.user && this.user.role === 'PATIENT') {
      this.router.navigate(['/']);
    }
  }
}
