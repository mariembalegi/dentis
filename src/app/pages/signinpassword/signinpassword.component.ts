import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signinpassword',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signinpassword.component.html',
  styleUrls: ['./signinpassword.component.scss']
})
export class SigninpasswordComponent implements OnInit {
  email = '';
  password = '';
  showPassword = false;
  rememberMe = true;
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router, 
    private signupService: SignupService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.email = this.signupService.getEmail();
  }

  onBackClick() {
    this.router.navigate(['/signin/signinemail']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onContinueClick() {
    this.errorMessage = '';
    
    if (!this.password) {
      this.errorMessage = 'Le mot de passe est requis';
      return;
    }

    this.isLoading = true;
    this.authService.login({ email: this.email, motDePasse: this.password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Navigate according to role if needed, or just dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error', err);
        this.errorMessage = 'Identifiants invalides ou erreur serveur';
      }
    });
  }
}
