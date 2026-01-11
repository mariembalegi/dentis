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
    if (!this.telephone.trim()) {
      this.telephoneError = true;
      return;
    }

    this.telephoneError = false;
    // Continue to next step
    this.router.navigate(['/']);
  }

  onTelephoneChange() {
    this.telephoneError = false;
  }
}
