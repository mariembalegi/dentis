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
  
  delegationsOptions: string[] = [];
  // Use a list to preserve order if needed, or just keys.
  gouvernoratList: string[] = [
    "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", 
    "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse", 
    "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", 
    "Sidi Bouzid", "Gabès", "Médenine", "Tataouine", "Gafsa", 
    "Tozeur", "Kébili"
  ];

  tunisiaData: any = {
    "Tunis": {
      "Carthage": ["Carthage", "Amilcar", "Carthage Byrsa", "Carthage Plage"],
      "La Marsa": ["La Marsa", "Gammarth", "Sidi Daoud", "Marsa Ville"],
      "Le Bardo": ["Le Bardo", "Bardo Nord", "Ksar Said"],
      "Sidi Bou Said": ["Sidi Bou Said"],
      "Centre Ville": ["Lafayette", "Montplaisir", "Avenue Habib Bourguiba"],
      "El Menzah": ["El Menzah 1", "El Menzah 4", "El Menzah 9", "Mutuelleville"],
    },
    "Ariana": {
      "Ariana Ville": ["Ariana", "Nouvelle Ariana", "Ariana Supérieure", "Menzah 8"],
      "La Soukra": ["La Soukra", "Chotrana 1", "Chotrana 2", "Chotrana 3", "Sidi Frej"],
      "Raoued": ["Raoued", "Riadh Andalous", "Ghazela"],
      "Ettadhamen": ["Ettadhamen", "Cité El Bassatine"],
      "Mnihla": ["Mnihla", "Cité El Refaha"]
    },
    "Ben Arous": {
      "Hammam Lif": ["Hammam Lif", "Bou Kornine"],
      "Radès": ["Radès", "Radès Méliane", "Radès Forêt"],
      "Ezzahra": ["Ezzahra", "Borj Cedria"],
      "Megrine": ["Megrine Coteaux", "Megrine Chaker", "Sidi Rezig"],
      "Mourouj": ["Mourouj 1", "Mourouj 3", "Mourouj 5", "Mourouj 6"]
    },
    "Manouba": {
        "Manouba": ["Manouba", "Denden"],
        "Oued Ellil": ["Oued Ellil", "Cité El Ward"],
        "Tebourba": ["Tebourba"],
        "Mornaguia": ["Mornaguia"]
    },
    "Nabeul": {
        "Nabeul": ["Nabeul", "Les Deux Oueds"],
        "Hammamet": ["Hammamet Nord", "Hammamet Sud", "Yasmine Hammamet"],
        "Dar Chaabane": ["Dar Chaabane El Fehri"],
        "Kelibia": ["Kelibia"],
        "Grombalia": ["Grombalia"]
    },
    "Zaghouan": { "Zaghouan": ["Zaghouan Ville"] },
    "Bizerte": { "Bizerte Nord": ["Bizerte"], "Zarzouna": ["Zarzouna"] },
    "Béja": { "Béja Nord": ["Béja"] },
    "Jendouba": { "Jendouba Nord": ["Jendouba"] },
    "Le Kef": { "Kef Ouest": ["Le Kef"] },
    "Siliana": { "Siliana Nord": ["Siliana"] },
    "Sousse": {
      "Sousse Ville": ["Sousse", "Boujaffar", "Khezama", "Sahloul"],
      "Hammam Sousse": ["Hammam Sousse", "El Kantaoui"],
      "Msaken": ["Msaken", "Beni Kalthoum"],
      "Kalaa Kebira": ["Kalaa Kebira"],
      "Akouda": ["Akouda"]
    },
    "Monastir": {
        "Monastir": ["Monastir", "Skanes"],
        "Moknine": ["Moknine"],
        "Jammel": ["Jammel"],
        "Ksar Hellal": ["Ksar Hellal"]
    },
    "Mahdia": { "Mahdia": ["Mahdia Ville", "Hiboun"] },
    "Sfax": {
      "Sfax Ville": ["Sfax", "Bab Bhar", "Sfax El Jadida"],
      "Sakiet Ezzit": ["Sakiet Ezzit", "Sidi Saleh"],
      "Sakiet Eddaier": ["Sakiet Eddaier"],
      "Thyna": ["Thyna"],
      "El Hencha": ["El Hencha"]
    },
    "Kairouan": { "Kairouan Nord": ["Kairouan"] },
    "Kasserine": { "Kasserine Nord": ["Kasserine"] },
    "Sidi Bouzid": { "Sidi Bouzid Ouest": ["Sidi Bouzid"] },
    "Gabès": { "Gabès Médina": ["Gabès"] },
    "Médenine": { "Médenine Nord": ["Médenine"], "Djerba Houmt Souk": ["Houmt Souk"] },
    "Tataouine": { "Tataouine Nord": ["Tataouine"] },
    "Gafsa": { "Gafsa Nord": ["Gafsa"] },
    "Tozeur": { "Tozeur": ["Tozeur Ville"] },
    "Kébili": { "Kébili Nord": ["Kébili"] }
  };

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

  // Helper to load delegation options without clearing existing value
  updateDelegationOptions() {
      if (this.editProfileData.gouvernorat && this.tunisiaData[this.editProfileData.gouvernorat]) {
          this.delegationsOptions = Object.keys(this.tunisiaData[this.editProfileData.gouvernorat]);
      } else {
          this.delegationsOptions = [];
      }
  }

  onGouvernoratChange() {
      this.editProfileData.delegation = '';
      this.updateDelegationOptions();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
         this.editProfileData.diplome = e.target.result;
      };
      reader.readAsDataURL(file);
    }
 }

  openProfileEdit() {
    if (!this.dentist) return;
    this.editProfileData = { ...this.dentist };
    this.updateDelegationOptions();
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
