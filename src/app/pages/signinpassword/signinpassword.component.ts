import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup.service';

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

  constructor(private router: Router, private signupService: SignupService) {}

  ngOnInit() {
    this.email = this.signupService.getEmail();
  }

  onBackClick() {
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onContinueClick() {
    // Continue to dashboard
    this.router.navigate(['/dashboard']);
  }
}
