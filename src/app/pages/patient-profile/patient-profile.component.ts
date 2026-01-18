import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent implements OnInit {
  user: User | null = null;
  initials = '';

  // Edit modal state
  showProfileEditModal = false;
  editProfileData: any = {};

  // Tunisia data for gouvernorat/delegation dropdowns
  gouvernoratList: string[] = [
    "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", 
    "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse", 
    "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", 
    "Sidi Bouzid", "Gabès", "Médenine", "Tataouine", "Gafsa", 
    "Tozeur", "Kébili"
  ];

  delegationsOptions: string[] = [];

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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const currentUser = this.authService.getUser();
    if (currentUser) {
      this.user = currentUser;
      this.computeInitials();
    }
  }

  computeInitials() {
    if (this.user) {
      const first = this.user.prenom ? this.user.prenom.charAt(0) : '';
      const last = this.user.nom ? this.user.nom.charAt(0) : '';
      this.initials = (first + last).toUpperCase();
    }
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.user) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const photoBase64 = e.target.result;
        // Update local object immediately
        this.user!.photo = photoBase64;
        
        // TODO: Call API to save actually
        console.log('Photo selected for patient');
      };
      reader.readAsDataURL(file);
    }
  }

  formatBirthDate(): string {
    if (!this.user?.dateNaissanceP) return 'Non renseigné';
    return this.user.dateNaissanceP;
  }

  calculateAge(): number {
    if (!this.user?.dateNaissanceP) return 0;
    const birthDateString = this.user.dateNaissanceP;
    let birthDate: Date;

    if (birthDateString.includes('/')) {
      const parts = birthDateString.split('/');
      birthDate = new Date(+parts[2], +parts[1] - 1, +parts[0]);
    } else {
      birthDate = new Date(birthDateString);
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Edit modal
  openProfileEdit() {
    if (!this.user) return;
    this.editProfileData = {
      nom: this.user.nom || '',
      prenom: this.user.prenom || '',
      email: this.user.email || '',
      tel: (this.user as any).tel || '',
      dateNaissanceP: this.user.dateNaissanceP || '',
      sexe: (this.user as any).sexe || '',
      groupeSanguin: this.user.groupeSanguinP || '',
      recouvrement: this.user.recouvrementP || ''
    };
    this.showProfileEditModal = true;
  }

  closeProfileEdit() {
    this.showProfileEditModal = false;
  }

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

  saveProfile() {
    // Update local user data with edited values
    if (this.user) {
      this.user.nom = this.editProfileData.nom;
      this.user.prenom = this.editProfileData.prenom;
      this.user.email = this.editProfileData.email;
      (this.user as any).tel = this.editProfileData.tel;
      this.user.dateNaissanceP = this.editProfileData.dateNaissanceP;
      (this.user as any).sexe = this.editProfileData.sexe;
      
      // Prepare payload matching Backend expected keys
      const payload: any = {
        nom: this.user.nom,
        prenom: this.user.prenom,
        email: this.user.email,
        tel: (this.user as any).tel,
        role: this.user.role,
        photo: this.user.photo
      };

      // Map Patient specific fields to keys expected by UserRest (without 'P' suffix)
      if (this.user.dateNaissanceP) {
          // Ensure yyyy-MM-dd format (HTML date input gives this format)
          payload.dateNaissance = this.user.dateNaissanceP; 
      }
      
      if (this.editProfileData.groupeSanguin) {
          let gs = this.editProfileData.groupeSanguin;
          // Map to potential Enum constants
          gs = gs.replace('+', '_POSITIF');
          gs = gs.replace('-', '_NEGATIF');
          payload.groupeSanguin = gs;
          
          // Update local with readable value
          this.user.groupeSanguinP = this.editProfileData.groupeSanguin;
      }
      
      if (this.editProfileData.recouvrement) {
          let rec = this.editProfileData.recouvrement.toUpperCase();
          rec = rec.replace(/ /g, '_'); // Tiers Payant -> TIERS_PAYANT
          rec = rec.replace('É', 'E').replace('é', 'e'); // Removes accents if simple
          if (rec === 'MEDECIN_DE_LA_FAMILLE') rec = 'MEDECIN_FAMILLE'; // Guessed mapping
          // Handle 'Santé publique' -> 'SANTE_PUBLIQUE' handled by accent replace above?
          // 'Santé' -> 'SANTÉ' -> 'SANTE'. 
          rec = rec.replace('É', 'E').replace('È', 'E'); 
          
          payload.recouvrement = rec;
          
          // Update local with readable value
          this.user.recouvrementP = this.editProfileData.recouvrement;
      }
      
      if ((this.user as any).sexe) payload.sexe = (this.user as any).sexe;

      // Call API to save profile data
      this.authService.updateUser(this.user.id, payload).subscribe({
          next: () => {
              console.log('Profile updated success');
          },
          error: (err) => {
              console.error('Profile update failed', err);
              alert("Erreur lors de la mise à jour du profil");
          }
      });
    }
    this.closeProfileEdit();
  }

  logout() {
    this.authService.logout();
  }
}
