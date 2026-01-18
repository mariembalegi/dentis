import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DentistService, DentistSearchResult, Horaire } from '../../services/dentist.service';
import { AuthService } from '../../services/auth.service';
import { LoginRequiredModalComponent } from '../../components/login-required-modal/login-required-modal.component';

@Component({
  selector: 'app-dentist-informations',
  standalone: true,
  imports: [CommonModule, LoginRequiredModalComponent],
  templateUrl: './dentist-informations.component.html',
  styleUrls: ['./dentist-informations.component.scss']
})
export class DentistInformationsComponent implements OnInit {
  selectedDentist: DentistSearchResult | null = null;
  horaires: Horaire[] = [];
  loadingDentist = false;
  showLoginModal = false;
  isPatientConnected = false;
  defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiBmaWxsPSJub25lIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFMEUwRTAiLz4KPHBhdGggZD0iTTIwIDEyQzE3Ljc5MDkgMTIgMTYgMTMuNzkwOSAxNiAxNkMxNiAxOC4yMDkxIDE3Ljc5MDkgMjAgMjAgMjBDMjIuMjA5MSAyMCAyNCAxOC4yMDkxIDIzLjE3MTYgMTZDMjQgMTMuNzkwOSAyMi4yMDkxIDEyIDIwIDEybTAtMkMyMy4zMTM3IDEwIDI2IDEyLjY4NjMgMjYgMTZDMjYgMTkuMzEzNyAyMy4zMTM3IDIyIDIwIDIyQzE2LjY4NjMgMjIgMTQgMTkuMzEzNyAxNCAxNkMxNCAxMi42ODYzIDE2LjY4NjMgMTAgMjAgMTBabTAgMjZDMjYuNjI3NCAzNiAzMiAzMC42Mjc0IDMyIDI0SDhDMzIgMzAuNjI3NCA4IDM2IDIwIDM2WiIgZmlsbD0iI0JEQkJEQiIvPgo8L3N2Zz4=';


  constructor(
    private dentistService: DentistService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  navigateToBooking() {
    if (!this.isPatientConnected) {
      this.showLoginModal = true;
      return;
    }
    this.router.navigate(['/dashboard/service-categories-booking'], {
      queryParams: {
        dentistId: this.selectedDentist?.id,
        dentistName: `${this.selectedDentist?.prenom} ${this.selectedDentist?.nom}`,
        dentistPhoto: this.selectedDentist?.photo || this.defaultAvatar
      }
    });
  }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
        this.isPatientConnected = !!user; // Assuming connected if user exists
    });

    this.route.params.subscribe(params => {
        const id = params['id'];
        if (id) {
            this.loadDentistDetails(+id);
        }
    });
    
    // Fallback for query params if needed, but params is cleaner for a detail page
    this.route.queryParams.subscribe(params => {
        const dentistId = params['dentistId'];
        if (dentistId && !this.selectedDentist) {
            this.loadDentistDetails(+dentistId);
        }
    });
  }

  loadDentistDetails(id: number) {
      this.loadingDentist = true;
      this.dentistService.getDentistById(id).subscribe({
          next: (dentist) => {
              this.selectedDentist = dentist;
              this.loadHoraires(id);
              this.loadingDentist = false;
          },
          error: (err) => {
              console.error('Failed to load dentist details', err);
              this.loadingDentist = false;
          }
      });
  }

  loadHoraires(id: number) {
    this.dentistService.getHoraires(id).subscribe({
      next: (data) => {
        const order = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
        this.horaires = data.sort((a, b) => order.indexOf(a.jourSemaine) - order.indexOf(b.jourSemaine));
      },
      error: (err) => console.error('Failed to load horaires', err)
    });
  }

  formatTime(time?: string): string {
    return time ? time.substring(0, 5) : '';
  }

  getDayLabel(day: string): string {
    return day.charAt(0) + day.slice(1).toLowerCase();
  }

  getScheduleString(h: Horaire): string {
    if (h.estFerme) return 'Fermé';
    let schedule = '';
    if (h.matinDebut && h.matinFin) {
      schedule += `${this.formatTime(h.matinDebut)} - ${this.formatTime(h.matinFin)}`;
    }
    if (h.apresMidiDebut && h.apresMidiFin) {
      if (schedule) schedule += ', ';
      schedule += `${this.formatTime(h.apresMidiDebut)} - ${this.formatTime(h.apresMidiFin)}`;
    }
    return schedule || 'Fermé';
  }

  getInitials(): string {
    if (!this.selectedDentist) return '';
    const first = this.selectedDentist.prenom ? this.selectedDentist.prenom.charAt(0) : '';
    const last = this.selectedDentist.nom ? this.selectedDentist.nom.charAt(0) : '';
    return (first + last).toUpperCase();
  }
}
