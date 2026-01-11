import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup.service';

@Component({
  selector: 'app-signuppassword',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signuppassword.component.html',
  styleUrls: ['./signuppassword.component.scss']
})
export class SignuppasswordComponent implements OnInit {
  email = '';
  password = '';
  showPassword = false;
  passwordError = false;
  passwordErrorMessage = '';

  constructor(private router: Router, private signupService: SignupService) {}

  ngOnInit() {
    this.email = this.signupService.getEmail();
  }

  onBackClick() {
    this.router.navigate(['/signup/birthdate']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  isPasswordValid(): boolean {
    // Au moins 8 caractères
    if (this.password.length < 8) {
      return false;
    }
    // Contient au moins une lettre
    if (!/[a-zA-Z]/.test(this.password)) {
      return false;
    }
    // Contient au moins un caractère spécial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.password)) {
      return false;
    }
    return true;
  }

  onContinueClick() {
    if (!this.password.trim()) {
      this.passwordError = true;
      this.passwordErrorMessage = 'Le mot de passe est requis';
      return;
    }

    if (!this.isPasswordValid()) {
      this.passwordError = true;
      this.passwordErrorMessage = 'Le mot de passe doit contenir au moins 8 caractères, des lettres et au moins un caractère spécial';
      return;
    }

    this.passwordError = false;
    // Continue to dashboard
    this.router.navigate(['/dashboard']);
  }

  onPasswordChange() {
    this.passwordError = false;
  }
}
