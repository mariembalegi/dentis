import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { ServiceMedicalService, ServiceMedical } from '../../services/service-medical.service';
import { RendezvousService, Rendezvous } from '../../services/rendezvous.service';
import { Router } from '@angular/router';

// Extended interface for UI display purposes
interface RendezvousDisplay extends Rendezvous {
  dentistPhoto?: string;
  dentistSpeciality?: string;
  // Use idRv from base interface
}

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
  appointments: RendezvousDisplay[] = [];
  
  // For Patient Booking
  selectedService: ServiceMedical | null = null;
  selectedAppointment: RendezvousDisplay | null = null;
  showPastAppointments = false;
  showCancelModal = false;
  appointmentToCancelId: number | null = null;

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
  
  defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiBmaWxsPSJub25lIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFMEUwRTAiLz4KPHBhdGggZD0iTTIwIDEyQzE3Ljc5MDkgMTIgMTYgMTMuNzkwOSAxNiAxNkMxNiAxOC4yMDkxIDE3Ljc5MDkgMjAgMjAgMjBDMjIuMjA5MSAyMCAyNCAxOC4yMDkxIDIzLjE3MTYgMTZDMjQgMTMuNzkwOSAyMi4yMDkxIDEyIDIwIDEybTAtMkMyMy4zMTM3IDEwIDI2IDEyLjY4NjMgMjYgMTZDMjYgMTkuMzEzNyAyMy4zMTM3IDIyIDIwIDIyQzE2LjY4NjMgMjIgMTQgMTkuMzEzNyAxNCAxNkMxNCAxMi42ODYzIDE2LjY4NjMgMTAgMjAgMTBabTAgMjZDMjYuNjI3NCAzNiAzMiAzMC42Mjc0IDMyIDI0SDhDMzIgMzAuNjI3NCA4IDM2IDIwIDM2WiIgZmlsbD0iI0JEQkJEQiIvPgo8L3N2Zz4=';


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

  get filteredAppointments(): RendezvousDisplay[] {
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
    // FORCE MOCK DATA FOR DEMO PURPOSES
    this.mockAppointments();

    /* 
    // Backend integration commented out for demo
    this.medicalService.getAllServices().subscribe(res => this.services = res);
    this.rendezvousService.getMyAppointments().subscribe(res => {
        this.appointments = res;
        if (this.appointments.length === 0) {
            this.mockAppointments();
        }
        if (this.appointments.length > 0) {
            this.selectedAppointment = this.appointments[0];
        }
    });
    */
  }

  mockAppointments() {
    this.appointments = [
      {
        idRv: 101,
        patientId: 1, // Mock
        dateRv: '2026-03-09',
        heureRv: '16:30',
        statutRv: 'VALIDATED', // Changed to match interface (CONFIRMÉ is not in type)
        serviceName: 'Consultation de suivi de cardiologie',
        dentistName: 'Dr Kossi TONYIGA',
        dentistSpeciality: 'Cardiologue',
        dentistPhoto: 'assets/images/doc1.jpg',
        descriptionRv: 'Mock'
      },
      {
        idRv: 102,
        patientId: 1,
        dateRv: '2025-12-05',
        heureRv: '10:00',
        statutRv: 'VALIDATED', // Was PASSE
        serviceName: 'Première consultation de médecine générale',
        dentistName: 'Dr Raouia Ben Ismail',
        dentistSpeciality: 'Médecin généraliste',
        dentistPhoto: 'assets/images/doc2.jpg',
        descriptionRv: 'Mock'
      },
      {
        idRv: 103,
        patientId: 1,
        dateRv: '2025-09-12',
        heureRv: '10:30',
        statutRv: 'VALIDATED',
        serviceName: 'Consultation ostéopathie',
        dentistName: 'M. Florent Meyrial',
        dentistSpeciality: 'Ostéopathe',
        dentistPhoto: 'assets/images/doc3.jpg',
        descriptionRv: 'Mock'
      }
    ] as RendezvousDisplay[];
    this.selectedAppointment = this.appointments[0];
  }

  get upcomingApps(): RendezvousDisplay[] {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments
      .filter(a => a.dateRv && a.dateRv >= today)
      .sort((a, b) => new Date(a.dateRv + 'T' + a.heureRv).getTime() - new Date(b.dateRv + 'T' + b.heureRv).getTime());
  }

  get pastApps(): RendezvousDisplay[] {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments
      .filter(a => a.dateRv && a.dateRv < today)
      .sort((a, b) => new Date(b.dateRv + 'T' + b.heureRv).getTime() - new Date(a.dateRv + 'T' + a.heureRv).getTime());
  }

  selectAppointment(rv: RendezvousDisplay) {
      this.selectedAppointment = rv;
  }

  isUpcoming(dateRv: string | undefined): boolean {
    if (!dateRv) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateRv >= today;
  }

  loadDentistData() {
    this.medicalService.getMyServices().subscribe(res => this.services = res);
    this.rendezvousService.getMyAppointments().subscribe(res => this.appointments = res);
  }

  // Patient Actions
  initiateBooking(service: ServiceMedical) {
    if (service.dentistId) {
      this.router.navigate(['/dashboard/dentist', service.dentistId]);
    } else {
      console.error('Service has no dentist ID');
    }
  }

  goToDentistProfile(dentistId: number) {
      this.router.navigate(['/dashboard/dentist', dentistId]);
  }

  rescheduleBooking(rv: RendezvousDisplay) {
    this.router.navigate(['/dashboard/date-booking'], {
      queryParams: {
        dentistName: rv.dentistName,
        dentistSpecialty: rv.dentistSpeciality,
        dentistAddress: '1 Rue Charles Drot, 92500 Rueil-Malmaison',
        dentistPhoto: rv.dentistPhoto,
        serviceName: rv.serviceName
      }
    });
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
    this.appointmentToCancelId = id;
    this.showCancelModal = true;
  }

  closeCancelModal() {
    this.showCancelModal = false;
    this.appointmentToCancelId = null;
  }

  confirmCancel() {
    if (this.appointmentToCancelId) {
      // Remove local appointment manually (don't call loadData to avoid mock reset)
      this.appointments = this.appointments.filter(a => a.idRv !== this.appointmentToCancelId);
      
      this.selectedAppointment = null; // Deselect
      this.closeCancelModal();
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
