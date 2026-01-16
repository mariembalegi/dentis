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
    { id: 1, name: 'Consultation de suivi dentaire', price: 60 },
    { id: 2, name: 'Première consultation dentaire', price: 80 },
    { id: 3, name: 'Urgence dentaire', price: 90 },
    { id: 4, name: 'Détartrage', price: 120 },
    { id: 5, name: 'Devis prothèse', price: 80 },
    { id: 6, name: 'Blanchiment des dents', price: 400 }
  ];

  selectedCategories: any[] = [];

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

  toggleCategory(category: any) {
    const index = this.selectedCategories.findIndex(c => c.id === category.id);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  isSelected(category: any): boolean {
    return this.selectedCategories.some(c => c.id === category.id);
  }

  continueBooking() {
    if (this.selectedCategories.length === 0) return;

    const names = this.selectedCategories.map(c => c.name).join(', ');
    const totalPrice = this.selectedCategories.reduce((sum, c) => sum + c.price, 0);

    this.router.navigate(['/dashboard/date-booking'], {
      queryParams: {
        dentistName: this.dentistName,
        dentistSpecialty: this.dentistSpecialty,
        dentistAddress: this.dentistAddress,
        dentistPhoto: this.dentistPhoto,
        serviceName: names,
        servicePrice: totalPrice
      }
    });
  }
}
