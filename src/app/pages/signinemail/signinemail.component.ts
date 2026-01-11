import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup.service';

@Component({
  selector: 'app-signinemail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signinemail.component.html',
  styleUrls: ['./signinemail.component.scss']
})
export class SigninemailComponent {
  emailOrPhone = '';
  errorMessage = '';

  constructor(private router: Router, private signupService: SignupService) {}

  onBackClick() {
    this.router.navigate(['/login']);
  }

  validateEmailOrPhone(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9\s]{10,}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  }

  onContinueClick() {
    this.errorMessage = '';

    if (!this.emailOrPhone.trim()) {
      this.errorMessage = '◆ Veuillez entrer votre adresse e-mail ou numéro de téléphone';
      return;
    }

    if (!this.validateEmailOrPhone(this.emailOrPhone)) {
      this.errorMessage = '◆ Adresse e-mail ou numéro de téléphone invalide';
      return;
    }

    // Store email/phone in service
    this.signupService.setEmail(this.emailOrPhone);
    // Navigate to password page
    this.router.navigate(['/signin/password']);
  }
}
