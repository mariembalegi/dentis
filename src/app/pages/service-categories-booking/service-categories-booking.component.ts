import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-service-categories-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-categories-booking.component.html',
  styleUrls: ['./service-categories-booking.component.scss']
})
export class ServiceCategoriesBookingComponent implements OnInit {
  dentistName = 'Dr Mohamed Achref Abdelbari'; // Placeholder
  dentistSpecialty = 'Dentiste';
  dentistAddress = '1 Rue Charles Drot, 92500 Rueil-Malmaison';
  dentistPhoto: string | null = null;
  patientName = '';
  // Removed step property as it's no longer needed for navigation logic within this component

  categories = [
    { id: 1, name: 'Consultation de suivi dentaire' },
    { id: 2, name: 'Première consultation dentaire' },
    { id: 3, name: 'Urgence dentaire' },
    { id: 4, name: 'Détartrage' },
    { id: 5, name: 'Devis prothèse' },
    { id: 6, name: 'Blanchiment des dents' }
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
        if (params['dentistName']) {
            this.dentistName = params['dentistName'];
        }
        if (params['dentistPhoto']) {
            this.dentistPhoto = params['dentistPhoto'];
        }
    });
  }

  goBack() {
      // Navigate back to dentist profile or dashboard
      this.router.navigate(['../dentist/1'], { relativeTo: this.route }); // Assuming ID 1 or get from params
  }

  selectCategory(category: any) {
    this.router.navigate(['/dashboard/date-booking'], {
      queryParams: {
        dentistName: this.dentistName,
        dentistSpecialty: this.dentistSpecialty,
        dentistAddress: this.dentistAddress,
        dentistPhoto: this.dentistPhoto,
        serviceName: category.name
      }
    });
  }
}
