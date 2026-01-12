import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent implements OnInit {
  patientName = '';
  dentistName = '';
  dentistSpecialty = 'Dentiste';
  dentistAddress = '';
  dentistPhoto: string | null = null;
  serviceName = '';
  appointmentDate = '';
  appointmentTime = '';
  
  hasConsulted: boolean | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get patient info
    this.authService.user$.subscribe(user => {
        if (user) {
          this.patientName = `${user.prenom} ${user.nom}`; 
        } else {
            // Placeholder if not logged in
            this.patientName = 'Moi';
        }
    });

    // Get booking info from valid query params
    this.route.queryParams.subscribe(params => {
       this.dentistName = params['dentistName'] || 'Dr Inconnu';
       this.dentistSpecialty = params['dentistSpecialty'] || 'Dentiste';
       this.dentistAddress = params['dentistAddress'] || '';
       this.dentistPhoto = params['dentistPhoto'] || null;
       this.serviceName = params['serviceName'] || 'Consultation';
       this.appointmentDate = params['date'] || '';
       this.appointmentTime = params['time'] || '';
    });
  }

  setHasConsulted(value: boolean) {
    this.hasConsulted = value;
  }

  confirmBooking() {
      // Implement actual booking logic here (call service)
      console.log('Booking confirmed!');
      alert('Rendez-vous confirmé !');
      this.router.navigate(['/']); // Redirect to home or appointments list
  }
}
