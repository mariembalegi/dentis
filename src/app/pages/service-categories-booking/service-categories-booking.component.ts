import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DentistService, DentistSearchResult, Horaire } from '../../services/dentist.service';
import { RendezvousService, Rendezvous } from '../../services/rendezvous.service';

interface ServiceCategory {
  id: number;
  name: string;
  price: number;
  selected?: boolean;
}

@Component({
  selector: 'app-service-categories-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-categories-booking.component.html',
  styleUrls: ['./service-categories-booking.component.scss']
})
export class ServiceCategoriesBookingComponent implements OnInit {
  dentistId: number | null = null;
  dentist: DentistSearchResult | null = null;
  patientName = '';
  patientId: number | null = null;

  categories: ServiceCategory[] = [];
  selectedCategories: ServiceCategory[] = [];
  
  // Availability
  availableSlots: any[] = [];
  selectedSlot: { date: string, time: string } | null = null;

  get dentistPhoto(): string | null {
    return this.dentist?.photo || null;
  }

  get dentistName(): string {
    return this.dentist ? `Dr ${this.dentist.prenom} ${this.dentist.nom}` : 'Dentiste';
  }

  get dentistSpecialty(): string {
    return this.dentist?.specialite || 'Dentiste';
  }

  get dentistAddress(): string {
    return this.dentist?.adresse || this.dentist?.ville || '';
  }

  getInitials(): string {
    if (!this.dentist) return '';
    const first = this.dentist.prenom ? this.dentist.prenom.charAt(0) : '';
    const last = this.dentist.nom ? this.dentist.nom.charAt(0) : '';
    return (first + last).toUpperCase();
  }

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthService,
    private dentistService: DentistService,
    private rendezvousService: RendezvousService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.patientName = `${user.prenom} ${user.nom}`;
        this.patientId = user.id;
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['dentistId']) {
        this.dentistId = +params['dentistId'];
        this.loadDentistData(this.dentistId);
      }
    });
  }

  loadDentistData(id: number) {
    this.dentistService.getDentistById(id).subscribe(data => {
      this.dentist = data;
      // Map services if available, else use fallback or empty
      if (data.services && data.services.length > 0) {
        this.categories = data.services.map((s: any) => ({
             id: s.id || s.numSM, // Handle different field names
             name: s.nomSM || s.name,
             price: s.tarifSM || s.price
        }));
      } else {
        // Fallback for demo if no services returned
        this.categories = [
            { id: 1, name: 'Consultation', price: 50 },
            { id: 2, name: 'Détartrage', price: 80 }
        ];
      }

      // Map available rendezvous
      if (data.availableRendezvous && data.availableRendezvous.length > 0) {
           this.processAvailableSlots(data.availableRendezvous);
      }
    });
  }

  processAvailableSlots(rvs: any[]) {
      // Group rendezvous by date - only DISPONIBLE status
      const grouped: { [key: string]: string[] } = {};
      const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

      rvs.forEach(rv => {
        // Only show available slots (DISPONIBLE status or no status means available)
        if (!rv.statutRv || rv.statutRv === 'DISPONIBLE') {
          const dateKey = rv.dateRv;
          if (!grouped[dateKey]) grouped[dateKey] = [];
          // Handle different time formats
          const time = rv.heureRv ? rv.heureRv.substring(0, 5) : '09:00';
          if (!grouped[dateKey].includes(time)) {
            grouped[dateKey].push(time);
          }
        }
      });

      // Convert to array format
      const slots: any[] = [];
      let first = true;
      
      // Sort dates
      const sortedDates = Object.keys(grouped).sort();
      
      for (const dateStr of sortedDates) {
        const d = new Date(dateStr + 'T00:00:00'); // Ensure proper parsing
        slots.push({
          dateRaw: dateStr,
          dateDisplay: `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
          times: grouped[dateStr].sort(),
          expanded: first
        });
        first = false;
      }
      
      this.availableSlots = slots;
  }

  goBack() {
      if (this.dentistId) {
        this.router.navigate(['/dashboard/dentist-informations', this.dentistId]);
      } else {
        this.router.navigate(['/dashboard/home']);
      }
  }

  toggleCategory(category: ServiceCategory) {
    const index = this.selectedCategories.findIndex(c => c.id === category.id);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  isSelected(category: ServiceCategory): boolean {
    return this.selectedCategories.some(c => c.id === category.id);
  }

  selectSlot(date: string, time: string) {
      this.selectedSlot = { date, time };
  }

  isSlotSelected(date: string, time: string): boolean {
      return this.selectedSlot?.date === date && this.selectedSlot?.time === time;
  }

  toggleDay(day: any) {
      day.expanded = !day.expanded;
  }

  confirmBooking() {
    if (this.selectedCategories.length === 0 || !this.selectedSlot || !this.dentist || !this.patientId) return;

    const serviceNames = this.selectedCategories.map(c => c.name).join(', ');
    
    const rv: Rendezvous = {
        patientId: this.patientId,
        dentistId: this.dentist.id,
        dateRv: this.selectedSlot.date,
        heureRv: this.selectedSlot.time,
        statutRv: 'NON_DISPONIBLE',
        descriptionRv: `Rendez-vous pour: ${serviceNames}`
    };

    this.rendezvousService.bookAppointmentREST(rv).subscribe({
        next: (createdRv: any) => {
            console.log('✅ Rendez-vous créé:', createdRv);
            const rendezvousId = createdRv.idRv || createdRv.id;
            
            this.router.navigate(['/dashboard/booking-confirmation'], {
                queryParams: {
                    date: this.selectedSlot?.date,
                    time: this.selectedSlot?.time,
                    dentistName: `${this.dentist?.prenom} ${this.dentist?.nom}`,
                    dentistAddress: this.dentist?.adresse || this.dentist?.ville,
                    serviceName: serviceNames,
                    rendezvousId: rendezvousId
                }
            });
        },
        error: (err) => console.error('❌ Erreur création rendez-vous:', err)
    });
  }
}
