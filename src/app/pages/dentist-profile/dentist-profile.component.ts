import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DentistService, DentistSearchResult, Horaire } from '../../services/dentist.service';
import { AuthService } from '../../services/auth.service';
import { WorkingHoursEditModalComponent, DaySchedule } from '../../components/working-hours-edit-modal/working-hours-edit-modal.component';

@Component({
  selector: 'app-dentist-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, WorkingHoursEditModalComponent],
  templateUrl: './dentist-profile.component.html',
  styleUrls: ['./dentist-profile.component.scss']
})
export class DentistProfileComponent implements OnInit {
  dentist: DentistSearchResult | null = null;
  horaires: Horaire[] = [];
  initials: string = '';
  
  // Edit states
  showProfileEditModal = false;
  showHorairesEditModal = false;
  
  // Form data
  editProfileData: any = {};
  editHorairesData: DaySchedule[] = [];

  constructor(
    private dentistService: DentistService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user && (user.role === 'DENTISTE' || user.role === 'ADMIN')) {
       this.loadProfile(user.id);
       this.loadHoraires(user.id);
    }
  }

  loadProfile(id: number) {
    this.dentistService.getDentistById(id).subscribe(data => {
      this.dentist = data;
      this.computeInitials();
    });
  }

  computeInitials() {
      if (this.dentist) {
          const first = this.dentist.prenom ? this.dentist.prenom.charAt(0) : '';
          const last = this.dentist.nom ? this.dentist.nom.charAt(0) : '';
          this.initials = (first + last).toUpperCase();
      }
  }

  loadHoraires(id: number) {
    this.dentistService.getHoraires(id).subscribe(data => {
      // Sort days: Lundi first
      const order = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
      this.horaires = data.sort((a, b) => order.indexOf(a.jourSemaine) - order.indexOf(b.jourSemaine));
    });
  }

  isBase64(str?: string): boolean {
      if (!str) return false;
      // Simple check for base64 like pattern or length
      return str.length > 50 && !str.includes(' ');
  }

  downloadDiplome() {
      if (!this.dentist?.diplome) return;
      // Create a link and download
      // access it as data URI if it starts with data:, otherwise assume it's just a string name
      const link = document.createElement('a');
      link.href = this.dentist.diplome.startsWith('data:') ? this.dentist.diplome : 'data:application/pdf;base64,' + this.dentist.diplome;
      link.download = `diplome_${this.dentist.nom}.pdf`; // Assume PDF or image
      link.click();
  }
  
  getScheduleForDay(day: string): string {
      const h = this.horaires.find(x => x.jourSemaine === day as any);
      if (!h || h.estFerme) return 'Fermé';
      const fmt = (t?: string) => t ? t.substring(0, 5) : '';
      return `${fmt(h.matinDebut)} - ${fmt(h.matinFin)}, ${fmt(h.apresMidiDebut)} - ${fmt(h.apresMidiFin)}`;
  }

  openProfileEdit() {
    if (!this.dentist) return;
    this.editProfileData = { ...this.dentist };
    this.showProfileEditModal = true;
  }
  
  closeProfileEdit() {
      this.showProfileEditModal = false;
  }

  saveProfile() {
    if (!this.dentist) return;
    this.dentistService.updateProfile(this.dentist.id, this.editProfileData).subscribe(updated => {
      // API might return null or updated object, fetch again to be sure
      this.loadProfile(this.dentist!.id);
      this.showProfileEditModal = false;
    });
  }

  openHorairesEdit() {
    const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
    this.editHorairesData = days.map(dayName => {
        const found = this.horaires.find(x => x.jourSemaine === dayName);
        const h: Horaire = found || { jourSemaine: dayName as any, estFerme: true };
        return {
            day: dayName,
            morning: { start: h.matinDebut?.substring(0,5) || '', end: h.matinFin?.substring(0,5) || '' },
            afternoon: { start: h.apresMidiDebut?.substring(0,5) || '', end: h.apresMidiFin?.substring(0,5) || '' },
            isClosed: !!h.estFerme
        } as DaySchedule;
    });
    this.showHorairesEditModal = true;
  }

  // Called from modal output
  closeHorairesEdit() {
    this.showHorairesEditModal = false;
  }
  
  // Called from modal output
  saveHoraires(newSchedule: DaySchedule[]) {
     if (!this.dentist) return;
     const payload: Horaire[] = newSchedule.map(d => ({
         jourSemaine: d.day as any,
         matinDebut: d.morning.start,
         matinFin: d.morning.end,
         apresMidiDebut: d.afternoon.start,
         apresMidiFin: d.afternoon.end,
         estFerme: d.isClosed
     }));
     
     this.dentistService.updateHoraires(this.dentist.id, payload).subscribe(() => {
         this.loadHoraires(this.dentist!.id);
         this.showHorairesEditModal = false;
     });
  }
}
