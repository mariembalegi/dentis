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
    <h1 class="page-title">S'inscrire</h1>
    
    <div class="signup-card">
      <a href="#" class="back-link" (click)="onBackClick(); $event.preventDefault()">← Étape précédente</a>
      
      <h2 class="form-title">Détails professionnels</h2>
      
      <div class="form-group">
        <label class="form-label">Ville</label>
        <select class="form-input" [(ngModel)]="ville">
           <option value="" disabled>Sélectionner votre ville</option>
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
         <label class="form-label">Diplôme (Fichier ou URL)</label>
         <!-- For simplicity, using a file input that will convert to base64 -->
         <input type="file" (change)="onFileSelected($event)" accept=".pdf, .jpg, .png" class="form-input">
         <p class="info-text">Un justificatif est requis pour valider votre compte.</p>
      </div>

      <button class="btn-continue" (click)="onContinueClick()">CONTINUER</button>

      <p class="error-message" *ngIf="errorMessage" style="color: red; margin-top: 10px;">{{ errorMessage }}</p>
    </div>
  `,
  styleUrls: ['../signupname/signupname.component.scss'] // Reusing styles
})
export class SignupDentistDetailsComponent implements OnInit {
  ville = '';
  diplomeBase64 = '';
  errorMessage = '';

  constructor(private router: Router, private signupService: SignupService) {}

  ngOnInit() {
    //
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
    if (!this.ville || !this.diplomeBase64) {
      this.errorMessage = 'Tous les champs sont requis (Ville et Diplôme).';
      return;
    }

    this.signupService.updateData({
      ville: this.ville,
      diplome: this.diplomeBase64
    });

    this.router.navigate(['/signup/password']);
  }
}
