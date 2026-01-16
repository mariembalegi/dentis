import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup.service';

@Component({
  selector: 'app-signuptel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signuptel.component.html',
  styleUrls: ['./signuptel.component.scss']
})
export class SignuptelComponent implements OnInit {
  email = '';
  telephone = '';
  telephoneError = false;

  constructor(private router: Router, private signupService: SignupService) {}

  ngOnInit() {
    this.email = this.signupService.getEmail();
  }

  onBackClick() {
    this.router.navigate(['/signup/password']);
  }

  onContinueClick() {
    // Validate Tunisian phone number format (8 digits)
    const cleanedPhone = this.telephone.replace(/\s/g, '');
    if (!cleanedPhone || cleanedPhone.length !== 8 || !/^\d{8}$/.test(cleanedPhone)) {
      this.telephoneError = true;
      return;
    }

    this.telephoneError = false;
    
    // Save phone and defaults
    this.signupService.updateData({ 
      tel: parseInt(cleanedPhone, 10)
    });

    const role = this.signupService.getRole();

    if (role === 'PATIENT') {
        // Patient registration
        this.signupService.registerPatient().subscribe({
          next: (res) => {
            alert('Inscription Patient réussie !');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Signup error', err);
            alert('Erreur lors de l\'inscription Patient.');
          }
        });
    } else {
        // Dentist registration
        this.signupService.registerDentist().subscribe({
          next: (res) => {
            alert('Inscription Dentiste réussie !');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Signup error', err);
            alert('Erreur lors de l\'inscription Dentiste.');
          }
        });
    }
  }

  onTelephoneChange() {
    this.telephoneError = false;
  }
}
