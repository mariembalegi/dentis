import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup.service';

@Component({
  selector: 'app-signup-dentist-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="content-container">
      <h1 class="page-title">S'inscrire</h1>
      
      <div class="signup-card">
        <a href="#" class="back-link" (click)="onBackClick(); $event.preventDefault()">← Étape précédente</a>
        
        <h2 class="form-title">Ajoutez les informations suivantes</h2>
        
        <div class="form-group">
          <label class="form-label">Sexe</label>
          <div class="radio-group">
            <label class="radio-option">
              <input type="radio" name="sexe" value="feminin" [(ngModel)]="sexe">
              <span class="radio-label">Féminin</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="sexe" value="masculin" [(ngModel)]="sexe">
              <span class="radio-label">Masculin</span>
            </label>
          </div>
        </div>

        <div class="form-row">
            <div class="form-group">
              <label class="form-label">Gouvernorat</label>
              <select class="form-input" [(ngModel)]="gouvernorat" (change)="onGouvernoratChange()">
                 <option value="" disabled>Sélectionner</option>
                 <option value="Tunis">Tunis</option>
                 <option value="Ariana">Ariana</option>
                 <option value="Ben Arous">Ben Arous</option>
                 <option value="Manouba">Manouba</option>
                 <option value="Nabeul">Nabeul</option>
                 <option value="Zaghouan">Zaghouan</option>
                 <option value="Bizerte">Bizerte</option>
                 <option value="Béja">Béja</option>
                 <option value="Jendouba">Jendouba</option>
                 <option value="Le Kef">Le Kef</option>
                 <option value="Siliana">Siliana</option>
                 <option value="Sousse">Sousse</option>
                 <option value="Monastir">Monastir</option>
                 <option value="Mahdia">Mahdia</option>
                 <option value="Sfax">Sfax</option>
                 <option value="Kairouan">Kairouan</option>
                 <option value="Kasserine">Kasserine</option>
                 <option value="Sidi Bouzid">Sidi Bouzid</option>
                 <option value="Gabès">Gabès</option>
                 <option value="Médenine">Médenine</option>
                 <option value="Tataouine">Tataouine</option>
                 <option value="Gafsa">Gafsa</option>
                 <option value="Tozeur">Tozeur</option>
                 <option value="Kébili">Kébili</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Délégation</label>
              <select class="form-input" [(ngModel)]="delegation" [disabled]="!gouvernorat">
                <option value="" disabled selected>Sélectionner</option>
                <option *ngFor="let del of delegationsOptions" [value]="del">{{ del }}</option>
              </select>
            </div>
        </div>

        <div class="form-group">
          <label class="form-label">Adresse Cabinet</label>
          <input type="text" class="form-input" placeholder="Adresse complète" [(ngModel)]="adresse">
        </div>

        <div class="form-row">
            <div class="form-group">
              <label class="form-label">Spécialité</label>
              <input type="text" class="form-input" placeholder="" [(ngModel)]="specialite">
            </div>

            <div class="form-group">
              <label class="form-label">Diplôme (Fichier ou Image)</label>
              <!-- For simplicity, using a file input that will convert to base64 -->
              <input type="file" (change)="onFileSelected($event)" accept=".pdf, image/*" class="form-input">
              <p class="info-text" style="font-size: 13px; color: #666; margin-top: 4px;">Un justificatif est requis pour valider votre compte.</p>
            </div>
        </div>

        <button class="btn-continue" (click)="onContinueClick()">CONTINUER</button>

        <p class="error-message" *ngIf="errorMessage" style="color: #D32F2F; margin-top: 10px; font-size: 13px; font-family: Roboto, sans-serif;">{{ errorMessage }}</p>
      </div>
    </div>
  `,
  styleUrls: ['../signupname/signupname.component.scss'] // Reusing styles
})
export class SignupDentistDetailsComponent implements OnInit {
  sexe = 'feminin';
  gouvernorat = '';
  delegation = '';
  adresse = '';
  specialite = '';
  diplomeBase64 = '';
  errorMessage = '';

  delegationsOptions: string[] = [];

  // Données simplifiées pour l'exemple - à compléter selon les besoins réels
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

  constructor(private router: Router, private signupService: SignupService) {}

  ngOnInit() {
    //
  }

  onGouvernoratChange() {
    this.delegation = '';
    
    if (this.gouvernorat && this.tunisiaData[this.gouvernorat]) {
      this.delegationsOptions = Object.keys(this.tunisiaData[this.gouvernorat]);
    } else {
      this.delegationsOptions = [];
    }
  }

  onBackClick() {
    this.router.navigate(['/signup/name']);
  }

  onFileSelected(event: any) {
     const file = event.target.files[0];
     if (file) {
       const reader = new FileReader();
       reader.onload = (e: any) => {
          this.diplomeBase64 = e.target.result;
       };
       reader.readAsDataURL(file);
     }
  }

  onContinueClick() {
    if (!this.sexe || !this.gouvernorat || !this.delegation || !this.adresse || !this.specialite || !this.diplomeBase64) {
      this.errorMessage = 'Tous les champs sont requis.';
      return;
    }

    // Map sex: feminin -> F, masculin -> M
    const mappedSexe = this.sexe === 'feminin' ? 'F' : 'M';

    this.signupService.updateData({
      sexe: mappedSexe,
      gouvernorat: this.gouvernorat,
      delegation: this.delegation,
      adresse: this.adresse,
      specialite: this.specialite,
      diplome: this.diplomeBase64
    });

    this.router.navigate(['/signup/password']);
  }
}
