import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-date-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-booking.component.html',
  styleUrls: ['./date-booking.component.scss']
})
export class DateBookingComponent implements OnInit {
  dentistName = 'Dr Mohamed Achref Abdelbari'; // Fallback
  dentistSpecialty = 'Dentiste';
  dentistAddress = '1 Rue Charles Drot, 92500 Rueil-Malmaison';
  dentistPhoto: string | null = null;
  patientName = '';
  selectedCategoryName: string = '';
  selectedCategoryPrice: number | null = null;

  availabilityDays = [
    { date: 'Lundi 9 mars 2026', slots: ['13:45', '16:30'], expanded: true },
    { date: 'Jeudi 12 mars 2026', slots: ['09:00', '09:45', '11:00', '14:00', '15:30'], expanded: false },
    { date: 'Lundi 16 mars 2026', slots: ['10:15', '16:45'], expanded: false },
    { date: 'Jeudi 19 mars 2026', slots: ['11:30', '14:45'], expanded: false },
    { date: 'Lundi 23 mars 2026', slots: ['09:15', '13:30', '17:00'], expanded: false }
  ];

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.patientName = `${user.prenom} ${user.nom}`;
      }
    });

    this.route.queryParams.subscribe(params => {
        if (params['dentistName']) this.dentistName = params['dentistName'];
        if (params['dentistSpecialty']) this.dentistSpecialty = params['dentistSpecialty'];
        if (params['dentistAddress']) this.dentistAddress = params['dentistAddress'];
        if (params['dentistPhoto']) this.dentistPhoto = params['dentistPhoto'];
        if (params['serviceName']) this.selectedCategoryName = params['serviceName'];
        if (params['servicePrice']) this.selectedCategoryPrice = params['servicePrice'];
    });
  }

  goBack() {
    // Navigate back to the previous page (service categories)
    window.history.back();
  }

  toggleDay(day: any) {
      day.expanded = !day.expanded;
  }

  selectSlot(day: any, slot: string) {
      console.log('Selected slot:', day.date, slot);
      
      this.router.navigate(['/dashboard/booking-confirmation'], {
          queryParams: {
              dentistName: this.dentistName,
              dentistSpecialty: this.dentistSpecialty,
              dentistAddress: this.dentistAddress,
              dentistPhoto: this.dentistPhoto,
              serviceName: this.selectedCategoryName,
              servicePrice: this.selectedCategoryPrice,
              date: day.date,
              time: slot
          }
      });
  }
}
