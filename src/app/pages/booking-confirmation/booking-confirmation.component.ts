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
  dentistAddress = '';
  serviceName = '';
  appointmentDate = '';
  appointmentTime = '';

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
            this.patientName = 'Moi';
        }
    });

    // Get booking info from query params
    this.route.queryParams.subscribe(params => {
       this.dentistName = params['dentistName'] || 'Dr Inconnu';
       this.dentistAddress = params['dentistAddress'] || '';
       this.serviceName = params['serviceName'] || 'Consultation';
       this.appointmentDate = params['date'] || '';
       this.appointmentTime = params['time'] || '';
    });
  }

  goToAppointments() {
    this.router.navigate(['/dashboard/booking']);
  }

  goHome() {
    this.router.navigate(['/dashboard/home']);
  }
}
