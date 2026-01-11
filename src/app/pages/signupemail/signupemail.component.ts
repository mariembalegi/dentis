import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup.service';

@Component({
  selector: 'app-signupemail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signupemail.component.html',
  styleUrls: ['./signupemail.component.scss']
})
export class SignupemailComponent {
  email = '';
  emailError = false;

  constructor(private router: Router, private signupService: SignupService) {}

  onBackClick() {
    this.router.navigate(['/login']);
  }

  onContinueClick() {
    if (!this.email.trim()) {
      this.emailError = true;
      return;
    }
    this.emailError = false;
    this.signupService.setEmail(this.email);
    this.router.navigate(['/signup/name']);
  }

  onEmailChange() {
    this.emailError = false;
  }
}
