import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DentistService, DentistSearchResult, Horaire } from '../../services/dentist.service';
import { RendezvousService, Rendezvous } from '../../services/rendezvous.service';

@Component({
  selector: 'app-date-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-booking.component.html',
  styleUrls: ['./date-booking.component.scss']
})
export class DateBookingComponent implements OnInit {
  dentistId: number | null = null;
  dentist: DentistSearchResult | null = null;
  horaires: Horaire[] = [];
  patientId: number | null = null;
  patientName = '';
  selectedCategoryName: string = '';
  selectedCategoryPrice: number | null = null;
  selectedServiceId: number | null = null;

  availabilityDays: { dateRaw: string, dateDisplay: string, slots: string[], expanded: boolean }[] = [];
  selectedSlot: { date: string, time: string } | null = null;

  get dentistName(): string {
    return this.dentist ? `Dr ${this.dentist.prenom} ${this.dentist.nom}` : 'Dentiste';
  }

  get dentistSpecialty(): string {
    return this.dentist?.specialite || 'Dentiste';
  }

  get dentistAddress(): string {
    return this.dentist?.adresse || this.dentist?.ville || '';
  }

  get dentistPhoto(): string | null {
    return this.dentist?.photo || null;
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
        if (params['serviceName']) this.selectedCategoryName = params['serviceName'];
        if (params['servicePrice']) this.selectedCategoryPrice = +params['servicePrice'];
        if (params['serviceId']) this.selectedServiceId = +params['serviceId'];
    });
  }

  loadDentistData(id: number) {
    this.dentistService.getDentistById(id).subscribe(data => {
      this.dentist = data;
      this.loadHoraires(id);
      
      // If dentist has available rendezvous, use them
      if (data.availableRendezvous && data.availableRendezvous.length > 0) {
        this.processAvailableSlots(data.availableRendezvous);
      } else {
        // Generate slots based on horaires
        // Will be called after horaires are loaded
      }
    });
  }

  loadHoraires(id: number) {
    this.dentistService.getHoraires(id).subscribe({
      next: (data) => {
        const order = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
        this.horaires = data.sort((a, b) => order.indexOf(a.jourSemaine) - order.indexOf(b.jourSemaine));
        this.generateAvailableSlots();
      },
      error: () => this.generateMockSlots()
    });
  }

  generateAvailableSlots() {
    // Generate slots for the next 14 days based on horaires
    const days = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    const daysFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    const today = new Date();
    const slots: { dateRaw: string, dateDisplay: string, slots: string[], expanded: boolean }[] = [];

    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      const dayName = days[d.getDay()];
      const horaire = this.horaires.find(h => h.jourSemaine === dayName);
      
      if (!horaire || horaire.estFerme) continue;
      
      // Generate time slots based on horaire
      const timeSlots: string[] = [];
      
      if (horaire.matinDebut && horaire.matinFin) {
        const morningSlots = this.generateTimeSlots(horaire.matinDebut, horaire.matinFin);
        timeSlots.push(...morningSlots);
      }
      
      if (horaire.apresMidiDebut && horaire.apresMidiFin) {
        const afternoonSlots = this.generateTimeSlots(horaire.apresMidiDebut, horaire.apresMidiFin);
        timeSlots.push(...afternoonSlots);
      }
      
      if (timeSlots.length > 0) {
        slots.push({
          dateRaw: d.toISOString().split('T')[0],
          dateDisplay: `${daysFr[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
          slots: timeSlots,
          expanded: slots.length === 0 // Expand first day
        });
      }
    }
    
    this.availabilityDays = slots;
  }

  generateTimeSlots(start: string, end: string): string[] {
    const slots: string[] = [];
    const startParts = start.split(':').map(Number);
    const endParts = end.split(':').map(Number);
    
    let current = startParts[0] * 60 + startParts[1];
    const endMinutes = endParts[0] * 60 + endParts[1];
    
    while (current < endMinutes) {
      const hours = Math.floor(current / 60);
      const mins = current % 60;
      slots.push(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
      current += 30; // 30 minute intervals
    }
    
    return slots;
  }

  generateMockSlots() {
    const today = new Date();
    const daysFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    for (let i = 1; i <= 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() === 0) continue; // Skip Sunday

      this.availabilityDays.push({
        dateRaw: d.toISOString().split('T')[0],
        dateDisplay: `${daysFr[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
        slots: ['09:00', '10:00', '14:00', '16:00'],
        expanded: i === 1
      });
    }
  }

  processAvailableSlots(rvs: any[]) {
    // Group rendezvous by date
    const grouped: { [key: string]: string[] } = {};
    const daysFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    rvs.forEach(rv => {
      if (rv.statutRv === 'DISPONIBLE') {
        if (!grouped[rv.dateRv]) grouped[rv.dateRv] = [];
        grouped[rv.dateRv].push(rv.heureRv.substring(0, 5));
      }
    });

    let first = true;
    for (const dateStr of Object.keys(grouped).sort()) {
      const d = new Date(dateStr);
      this.availabilityDays.push({
        dateRaw: dateStr,
        dateDisplay: `${daysFr[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
        slots: grouped[dateStr].sort(),
        expanded: first
      });
      first = false;
    }
  }

  goBack() {
    window.history.back();
  }

  toggleDay(day: any) {
    day.expanded = !day.expanded;
  }

  selectSlot(day: any, slot: string) {
    this.selectedSlot = { date: day.dateRaw, time: slot };
  }

  isSlotSelected(dateRaw: string, time: string): boolean {
    return this.selectedSlot?.date === dateRaw && this.selectedSlot?.time === time;
  }

  confirmBooking() {
    if (!this.selectedSlot || !this.dentist || !this.patientId) return;

    const rv: Rendezvous = {
      patientId: this.patientId,
      dentistId: this.dentist.id,
      serviceId: this.selectedServiceId || undefined,
      dateRv: this.selectedSlot.date,
      heureRv: this.selectedSlot.time,
      statutRv: 'NON_DISPONIBLE',
      descriptionRv: `Rendez-vous pour: ${this.selectedCategoryName || 'Consultation'}`
    };

    this.rendezvousService.bookAppointment(rv).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/booking-confirmation'], {
          queryParams: {
            date: this.selectedSlot?.date,
            time: this.selectedSlot?.time,
            dentistName: this.dentistName,
            dentistAddress: this.dentistAddress,
            serviceName: this.selectedCategoryName
          }
        });
      },
      error: (err) => console.error('Booking failed', err)
    });
  }
}
