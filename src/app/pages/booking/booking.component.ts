import { Component, OnInit, HostListener } from '@angular/core';
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
  totalPrice?: number;
  patientCoverage?: string;
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
  upcomingApps: RendezvousDisplay[] = [];
  pastApps: RendezvousDisplay[] = [];
  loading = false;
  
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


  // Calendar Logic
  currentWeekStart: Date = new Date(); // Start of the current week displayed
  weekDays: Date[] = [];
  hours: string[] = [];
  
  // Calendar Events
  calendarEvents: any[] = [];
  selectedCalendarEvent: any = null;

  // Right Click Context Menu
  showContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 };
  contextMenuEvent: any = null;

  // Mini Calendar State
  miniCalendarDays: Date[] = [];

  // Add Appointment Modal State
  showAddAppointmentModal = false;
  newAppointmentDate: Date | null = null;
  newAppointmentTime: string = '';
  newAppointmentPatientName: string = '';
  newAppointmentNote: string = '';
  newAppointmentServices: string[] = [];

  availableServices = [
    'Consultation standard',
    'Détartrage',
    'Urgence dentaire', 
    'Implantologie',
    'Prothèse',
    'Blanchiment',
    'Extraction',
    'Suivi'
  ];

  mockPatientsList = [
    { id: 1, name: 'MEUNIER Emma' },
    { id: 2, name: 'DEMO Dominique' },
    { id: 3, name: 'PIGNON François' },
    { id: 4, name: 'LEBLANC Juste' },
    { id: 5, name: 'ZIDANE Zinedine' },
    { id: 6, name: 'CROFT Lara' },
    { id: 7, name: 'TEST Tim' },
    { id: 8, name: 'DUPONT Nathalie' }
  ];

  constructor(
    private authService: AuthService,
    private medicalService: ServiceMedicalService,
    private rendezvousService: RendezvousService,
    private router: Router
  ) {
    this.initCalendar();
  }
  
  selectCalendarEvent(event: any) {
      this.selectedCalendarEvent = event;
  }

  onRightClickEvent(event: MouseEvent, calendarEvent: any) {
    event.preventDefault(); // Prevent default browser context menu
    event.stopPropagation();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextMenuEvent = calendarEvent;
    this.showContextMenu = true;
  }

  closeContextMenu() {
    this.showContextMenu = false;
    this.contextMenuEvent = null;
  }

  editEvent(calendarEvent: any) {
    this.closeContextMenu();
    // Logic to open edit modal (using Add Modal for now passing data)
    this.newAppointmentDate = new Date(calendarEvent.start);
    const start = new Date(calendarEvent.start);
    this.newAppointmentTime = start.toTimeString().substring(0, 5);
    this.newAppointmentPatientName = calendarEvent.patient;
    this.newAppointmentNote = '';
    // If we had stored services on the event, we would load them here. 
    // For now, load based on serviceName if possible or empty
    this.newAppointmentServices = calendarEvent.serviceName ? [calendarEvent.serviceName] : []; 
    this.showAddAppointmentModal = true;
  }

  deleteEvent(calendarEvent: any) {
    if(confirm(`Voulez-vous supprimer le rendez-vous de ${calendarEvent.patient} ?`)) {
        // If it's a real backend event (has positive ID) or even if mock (we can try)
        // Ideally we differentiate. Assuming all will be real or we want to try backend for all
        if (calendarEvent.id) {
             this.rendezvousService.cancelAppointment(calendarEvent.id).subscribe({
                 next: () => {
                     this.calendarEvents = this.calendarEvents.filter(e => e !== calendarEvent);
                     if(this.selectedCalendarEvent === calendarEvent) {
                         this.selectedCalendarEvent = null;
                     }
                 },
                 error: (err) => {
                     console.error('Erreur suppression', err);
                     // Fallback for mock data or if backend fails but we want to remove from UI (optional)
                     // this.calendarEvents = this.calendarEvents.filter(e => e !== calendarEvent);
                     alert('Impossible de supprimer ce rendez-vous.');
                 }
             });
        } else {
             // Just remove from UI if no ID (should not happen for persisted ones)
             this.calendarEvents = this.calendarEvents.filter(e => e !== calendarEvent);
        }
    }
    this.closeContextMenu();
  }

  rejectAppointment(calendarEvent: any) {
      if(confirm(`Voulez-vous rejeter le rendez-vous de ${calendarEvent.patient} ?`)) {
          // In a real app, this would call an API
          this.calendarEvents = this.calendarEvents.filter(e => e !== calendarEvent);
          this.selectedCalendarEvent = null;
      }
  }
  
  // Also close menu on global click
  @HostListener('document:click')
  documentClick() {
    if (this.showContextMenu) {
      this.closeContextMenu();
    }
  }

  initCalendar() {
    this.hours = [];
    // Initialize hours based on max working range (9:00 to 18:00)
    // 18:00 is closing time, so the last slot is 17:00-18:00
    for (let i = 9; i < 18; i++) {
        this.hours.push(`${i}:00`);
    }
    this.updateWeekDays();
  }

  updateWeekDays() {
    // Adjust currentWeekStart to be the Monday of the week
    const day = this.currentWeekStart.getDay();
    const diff = this.currentWeekStart.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(this.currentWeekStart.setDate(diff));
    this.currentWeekStart = new Date(monday); // ensure new object

    this.weekDays = [];
    // Show Mon-Sun (7 days) as requested
    for (let i = 0; i < 7; i++) { 
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        this.weekDays.push(d);
    }
    this.generateMiniCalendar();
  }

  generateMiniCalendar() {
      const referenceDate = new Date(this.currentWeekStart); 
      // Set to first day of month of the current week start
      // Note: If the week spans two months (e.g. end of June, start of July), 
      // typically we show the month of the Monday, or the majority. Let's use Monday.
      const firstOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
      
      // Get the Monday of the week containing firstOfMonth (or prior) to fill the grid
      const day = firstOfMonth.getDay(); 
      const startDayDiff = (day === 0 ? -6 : 1) - day; // Monday base
      
      const startDate = new Date(firstOfMonth);
      startDate.setDate(firstOfMonth.getDate() + startDayDiff);
      
      this.miniCalendarDays = [];
      // 6 rows * 7 days = 42 days
      for(let i=0; i<42; i++) {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + i);
          this.miniCalendarDays.push(d);
      }
  }

  get miniCalRows(): Date[][] {
      const rows = [];
      for(let i=0; i<this.miniCalendarDays.length; i+=7) {
          rows.push(this.miniCalendarDays.slice(i, i+7));
      }
      return rows;
  }

  // Check if a day is in the currently displayed week (to highlight row/days)
  isInCurrentWeek(date: Date): boolean {
      if(!this.weekDays.length) return false;
      const dTime = date.getTime();
      // Only checking against the 5 displayed days (Mon-Fri). 
      // But visually the row should be selected if it's that week.
      const start = this.weekDays[0];
      // Check if it's in the same week as the start day
      // Simple way: get Monday of 'date' and compare or just check range
      // Let's just highlight the specific days that are in weekDays
      return this.weekDays.some(wd => wd.toDateString() === date.toDateString());
  }
  
  // Check if a day is in the current month displayed (for styling opacity)
  isCurrentMonth(date: Date): boolean {
      return date.getMonth() === this.currentWeekStart.getMonth();
  }

  prevWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.updateWeekDays();
    this.loadCalendarEvents();
  }

  nextWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.updateWeekDays();
    this.loadCalendarEvents();
  }

  prevMonth() {
    this.currentWeekStart.setMonth(this.currentWeekStart.getMonth() - 1);
    // ensure updates logic runs
    this.updateWeekDays();
    this.loadCalendarEvents();
  }

  nextMonth() {
    this.currentWeekStart.setMonth(this.currentWeekStart.getMonth() + 1);
    this.updateWeekDays();
    this.loadCalendarEvents();
  }

  goToWeek(day: Date) {
      this.currentWeekStart = new Date(day);
      this.updateWeekDays();
      this.loadCalendarEvents();
  }

  goToToday() {
    this.currentWeekStart = new Date();
    this.updateWeekDays();
    this.loadCalendarEvents();
  }
  
  getEventsForDay(date: Date, hour: string): any[] {
     // Check if any event starts at this hour on this day
     // Simple string matching for demo
     const dateStr = date.toISOString().split('T')[0];
     // Format hour '8:00' -> '08:00' if needed
     const hourInt = parseInt(hour.split(':')[0]);
     
     return this.calendarEvents.filter(e => {
         const eDate = new Date(e.start);
         const eDateStr = eDate.toISOString().split('T')[0];
         const eHour = eDate.getHours();
         return eDateStr === dateStr && eHour === hourInt;
     });
  }

  // Calculate style for event block (height based on duration, top offset if minutes)
  getEventStyle(event: any) {
      const start = new Date(event.start);
      const minutes = start.getMinutes();
      const duration = event.duration || 30; // minutes
      
      // Assuming 60px height per hour slot
      const top = (minutes / 60) * 100; // percentage or px? better px if relative to slot
      const height = (duration / 60) * 100; // percentage of slot height? 
      // Actually standard way: Grid row spanning or absolute positioning within the day column.
      // Let's use absolute positioning within the day column container.
      
      // We will place events simply in the cell for now, or use a sophisticated calculation in HTML/CSS
      return {
          'top.px': (minutes / 60) * 60, // 60px height per hour
          'height.px': (duration / 60) * 60,
          'background-color': event.color
      };
  }

  loadCalendarEvents() {
    this.rendezvousService.getMyAppointments().subscribe({
        next: (appointments) => {
            this.calendarEvents = appointments.map(rv => {
                // Ensure date and time formatting
                const startIso = `${rv.dateRv}T${rv.heureRv.length === 5 ? rv.heureRv + ':00' : rv.heureRv}`;
                
                return {
                    id: rv.idRv,
                    start: startIso,
                    duration: 30, // Default duration
                    patient: rv.patientName || 'Patient Inconnu',
                    color: this.getStatusColor(rv.statutRv),
                    serviceName: rv.serviceName || 'Consultation',
                    phone: '', // Detailed info might need separate fetch or expanded DTO
                    birthDate: '', 
                    gender: 'M',
                    bloodGroup: '?',
                    coverageType: '?',
                    totalPrice: 0,
                    status: rv.statutRv
                };
            });
        },
        error: (err) => console.error('Failed to load real appointments', err)
    });
  }

  getStatusColor(status: string | undefined): string {
      switch(status) {
          case 'DISPONIBLE': return '#AED6F1'; // Blue (Available)
          case 'NON_DISPONIBLE': return '#E0E0E0'; // Grey (Not Available)
          case 'VALIDATED': return '#D2EBD8'; // Green
          case 'PENDING': return '#FAD284'; // Yellow
          case 'REFUSED': return '#F4AAB9'; // Red
          default: return '#AED6F1'; // Blue default
      }
  }



  getEventsForDaySimple(day: Date): any[] {
      const dStr = day.toISOString().split('T')[0];
      return this.calendarEvents.filter(e => e.start.startsWith(dStr));
  }
  
  // Calculate relative top position pixels from 9:00
  getEventTop(event: any): number {
    const start = new Date(event.start);
    const h = start.getHours();
    const m = start.getMinutes();
    
    // Base hour is 9:00. Each hour is 60px height.
    return (h - 9) * 60 + m;
  }
  
  getEndTime(event: any): string {
    if (!event || !event.start) return '';
    const start = new Date(event.start);
    const end = new Date(start.getTime() + (event.duration || 30) * 60000);
    return end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  getEventHeight(event: any): number {
      // return event.duration; 
      // User request: Uniform size like LEBLANC Juste (30min = 30px)
      return 30; 
  }

  getAge(birthDateString: string): string {
    if (!birthDateString) return '';
    const birth = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return `(${age} ans)`;
  }

  // --- Add Appointment Logic ---
  openAddAppointmentModal(day: Date) {
      this.newAppointmentDate = day;
      this.newAppointmentTime = '';
      this.newAppointmentPatientName = '';
      this.newAppointmentNote = '';
      this.newAppointmentServices = [];
      this.showAddAppointmentModal = true;
  }

  closeAddAppointmentModal() {
      this.showAddAppointmentModal = false;
      this.newAppointmentDate = null;
  }

  saveNewAppointment() {
      if (!this.newAppointmentDate || !this.newAppointmentTime) return;

      const dStr = this.newAppointmentDate.toISOString().split('T')[0];
      // Format time from 8:00 to 08:00:00 if needed
      let timeStr = this.newAppointmentTime; 
      if (timeStr.length === 4) timeStr = '0' + timeStr; 
      if (timeStr.length === 5) timeStr = timeStr + ':00'; 

      // If Dentist, create available slot via backend
      if (this.user && this.user.role === 'DENTISTE') {
          const slot = {
              dateRv: dStr,
              heureRv: timeStr,
              descriptionRv: this.newAppointmentNote || 'Créneau disponible'
          };
          
          this.rendezvousService.addAvailableSlot(slot).subscribe({
              next: () => {
                  alert('Créneau de rendez-vous ajouté avec succès');
                  this.loadCalendarEvents(); // RELOAD FROM BACKEND
                  this.closeAddAppointmentModal();
              },
              error: (err) => {
                  console.error('Erreur ajout créneau', err);
                  alert('Erreur: ' + (err.error || 'Impossible de créer le créneau'));
              }
          });
          return;
      }

      // Fallback for Patient or local mock (existing logic)
      const fullStart = `${dStr}T${timeStr}`;

      const newEvent = {
          id: Math.floor(Math.random() * 1000) + 100, // random ID
          start: fullStart,
          duration: 30, // Default duration
          patient: this.newAppointmentPatientName || '(Sans patient)',
          color: '#AED6F1', // Default blue-ish color
          isNew: true,
          phone: '', 
          birthDate: '', 
          gender: 'M',
          bloodGroup: '', 
          coverageType: '',
          serviceName: this.newAppointmentServices.join(', ') || 'Consultation'
      };

      this.calendarEvents.push(newEvent);
      
      // Force refresh? The getters should handle it if change detection runs
      this.closeAddAppointmentModal();
  }

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

    if (this.user?.role === 'ADMIN') {
      this.router.navigate(['/dashboard/admin']);
      return;
    }

    this.loadData();
  }

  /* Getters replaced by properties updated in updateFilteredLists() */
  
  updateFilteredLists() {
    if (!this.appointments) return;
    this.upcomingApps = this.appointments.filter(a => this.isUpcoming(a.dateRv)).sort((a,b) => new Date(a.dateRv).getTime() - new Date(b.dateRv).getTime());
    this.pastApps = this.appointments.filter(a => !this.isUpcoming(a.dateRv)).sort((a,b) => new Date(b.dateRv).getTime() - new Date(a.dateRv).getTime());
  }

  isUpcoming(dateStr: string): boolean {
    const today = new Date();
    today.setHours(0,0,0,0);
    return new Date(dateStr) >= today;
  }

  selectAppointment(app: RendezvousDisplay) {
    this.selectedAppointment = app;
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
    // Load appointments from API
    this.loading = true;
    this.rendezvousService.getMyAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments.map(rv => ({
          ...rv,
          dentistName: rv.dentistName || 'Dr Inconnu',
          dentistSpeciality: 'Dentiste',
          dentistPhoto: undefined,
          serviceName: rv.serviceName || rv.descriptionRv || 'Consultation'
        }));
        this.updateFilteredLists();
        if (this.upcomingApps.length > 0) {
          this.selectedAppointment = this.upcomingApps[0];
        } else if (this.pastApps.length > 0) {
          this.selectedAppointment = this.pastApps[0];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load appointments', err);
        this.appointments = [];
        this.updateFilteredLists();
        this.loading = false;
      }
    });
  }
  
  loadDentistData() {
     // Load calendar data
     this.initCalendar();
     this.loadCalendarEvents();
  }

  mockAppointments() {
    this.appointments = [
      {
        idRv: 102,
        patientId: 1,
        dateRv: '2025-12-05',
        heureRv: '10:00',
        statutRv: 'NON_DISPONIBLE', // Was PASSE
        serviceName: 'Première consultation dentaire',
        dentistName: 'Dr Raouia Ben Ismail',
        dentistSpeciality: 'Chirurgien-dentiste',
        dentistPhoto: undefined, // No image, use default
        descriptionRv: 'Mock'
      },
      {
        idRv: 103,
        patientId: 1,
        dateRv: '2025-09-12',
        heureRv: '10:30',
        statutRv: 'NON_DISPONIBLE',
        serviceName: 'Détartrage complet',
        dentistName: 'Dr. Florent Meyrial',
        dentistSpeciality: 'Chirurgien-dentiste',
        dentistPhoto: undefined, // No image, use default
        descriptionRv: 'Mock'
      },
      {
        idRv: 104,
        patientId: 1,
        dateRv: '2025-08-20',
        heureRv: '14:00',
        statutRv: 'NON_DISPONIBLE',
        serviceName: 'Consultation de suivi',
        dentistName: 'Dr. Sarah Connor',
        dentistSpeciality: 'Orthodontiste',
        dentistPhoto: undefined,
        descriptionRv: 'Mock'
      },
      {
        idRv: 105,
        patientId: 1,
        dateRv: '2025-07-15',
        heureRv: '09:15',
        statutRv: 'NON_DISPONIBLE',
        serviceName: 'Urgence dentaire',
        dentistName: 'Dr. John Doe',
        dentistSpeciality: 'Chirurgien-dentiste',
        dentistPhoto: undefined,
        descriptionRv: 'Mock'
      },
      {
        idRv: 106,
        patientId: 1,
        dateRv: '2025-05-30',
        heureRv: '11:45',
        statutRv: 'NON_DISPONIBLE',
        serviceName: 'Blanchiment des dents',
        dentistName: 'Dr. Emily Blunt',
        dentistSpeciality: 'Chirurgien-dentiste',
        dentistPhoto: undefined,
        descriptionRv: 'Mock'
      },
      {
        idRv: 107,
        patientId: 1,
        dateRv: '2025-03-22',
        heureRv: '16:00',
        statutRv: 'NON_DISPONIBLE',
        serviceName: 'Pose de couronne',
        dentistName: 'Dr. Gregory House',
        dentistSpeciality: 'Chirurgien-dentiste',
        dentistPhoto: undefined,
        descriptionRv: 'Mock'
      },
      {
        idRv: 108,
        patientId: 1,
        dateRv: '2025-01-10',
        heureRv: '08:30',
        statutRv: 'NON_DISPONIBLE',
        serviceName: 'Contrôle annuel',
        dentistName: 'Dr. Lisa Cuddy',
        dentistSpeciality: 'Pédodontiste',
        dentistPhoto: undefined,
        descriptionRv: 'Mock'
      }
    ] as RendezvousDisplay[];
    this.updateFilteredLists();
  }

  // Helper moved to updateFilteredLists



  isNewPatient(patientId: number): boolean {
    const today = new Date().toISOString().split('T')[0];
    // A patient is considered new if they have no validated appointments in the past
    // Using 'NON_DISPONIBLE' to represent a booked/validated appointment
    return !this.appointments.some(a => 
      a.patientId === patientId && 
      a.dateRv < today && 
      a.statutRv === 'NON_DISPONIBLE'
    );
  }

  // Removed duplicate loadDentistData
  // Removed duplicate mockDentistAppointments

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

  cancelRendezvousDentist(id: number) {
    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      this.rendezvousService.cancelAppointment(id).subscribe({
        next: () => this.loadData(),
        error: () => alert('Erreur lors de l\'annulation')
      });
    }
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
